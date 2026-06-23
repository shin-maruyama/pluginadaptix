<?php

declare(strict_types=1);

namespace PluginAdaptix\WordPressIntegration;

final class PluginAdaptixApiClient
{
    private const DEFAULT_BASE_URL = 'https://api.example.com/v1';
    private const API_KEY_OPTION = 'pluginadaptix_api_key';
    private const BASE_URL_OPTION = 'pluginadaptix_api_base_url';
    private const API_KEY_ENV = 'PLUGINADAPTIX_API_KEY';
    private const BASE_URL_ENV = 'PLUGINADAPTIX_API_BASE_URL';

    private string $baseUrl;
    private string $apiKey;
    private int $timeoutSeconds;
    /** @var list<string> */
    private array $secretValues;

    /**
     * @param array{
     *   base_url?: string,
     *   api_key?: string,
     *   timeout_seconds?: int
     * } $options
     */
    public function __construct(array $options = [])
    {
        $this->baseUrl = $this->normalizeBaseUrl(
            $options['base_url'] ?? $this->readSetting(self::BASE_URL_OPTION, self::BASE_URL_ENV, self::DEFAULT_BASE_URL)
        );
        $this->apiKey = trim(
            $options['api_key'] ?? $this->readSetting(self::API_KEY_OPTION, self::API_KEY_ENV, '')
        );
        $this->timeoutSeconds = max(1, (int) ($options['timeout_seconds'] ?? 10));
        $this->secretValues = $this->collectSecretValues($options);
    }

    /**
     * @return array<string, mixed>
     */
    public function getContractStatus(string $memberId): array
    {
        return $this->request('GET', '/contracts/status', [
            'query' => [
                'memberId' => $memberId,
            ],
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    public function listPlugins(string $memberId): array
    {
        return $this->request('GET', '/plugins', [
            'query' => [
                'memberId' => $memberId,
            ],
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    public function createDownloadToken(string $memberId, string $pluginId, string $licenseKey): array
    {
        return $this->request('POST', '/plugins/download-token', [
            'body' => [
                'memberId' => $memberId,
                'pluginId' => $pluginId,
                'licenseKey' => $licenseKey,
            ],
            'secrets' => [
                $licenseKey,
            ],
        ]);
    }

    /**
     * @param array{
     *   query?: array<string, string>,
     *   body?: array<string, string>,
     *   secrets?: list<string>
     * } $options
     * @return array<string, mixed>
     */
    private function request(string $method, string $path, array $options = []): array
    {
        if ($this->apiKey === '') {
            return $this->safeError('API_CLIENT_CONFIGURATION_ERROR', 'API設定を確認してください。');
        }

        if (!function_exists('wp_remote_request')) {
            return $this->safeError('API_CLIENT_RUNTIME_ERROR', 'WordPress HTTP APIを利用できません。');
        }

        $url = $this->buildUrl($path, $options['query'] ?? []);
        $args = [
            'method' => $method,
            'timeout' => $this->timeoutSeconds,
            'headers' => [
                'Accept' => 'application/json',
                'Content-Type' => 'application/json',
                'X-API-Key' => $this->apiKey,
            ],
        ];

        if (array_key_exists('body', $options)) {
            $encodedBody = function_exists('wp_json_encode')
                ? wp_json_encode($options['body'])
                : json_encode($options['body']);

            if ($encodedBody === false) {
                return $this->safeError('API_CLIENT_REQUEST_ERROR', 'リクエストを作成できませんでした。');
            }

            $args['body'] = $encodedBody;
        }

        $response = wp_remote_request($url, $args);

        if (function_exists('is_wp_error') && is_wp_error($response)) {
            return $this->safeError('API_CLIENT_NETWORK_ERROR', 'APIに接続できませんでした。');
        }

        if (!is_array($response)) {
            return $this->safeError('API_CLIENT_RESPONSE_ERROR', 'APIレスポンスを確認できませんでした。');
        }

        $statusCode = function_exists('wp_remote_retrieve_response_code')
            ? (int) wp_remote_retrieve_response_code($response)
            : 0;
        $body = function_exists('wp_remote_retrieve_body')
            ? (string) wp_remote_retrieve_body($response)
            : '';
        $decoded = json_decode($body, true);

        if (!is_array($decoded)) {
            return $this->safeError('API_CLIENT_RESPONSE_ERROR', 'APIレスポンスを確認できませんでした。');
        }

        if ($statusCode >= 200 && $statusCode < 300 && $this->isApiResponse($decoded)) {
            return $decoded;
        }

        if ($this->isApiResponse($decoded)) {
            return [
                'success' => false,
                'code' => (string) $decoded['code'],
                'message' => $this->sanitizeMessage((string) $decoded['message'], $options['secrets'] ?? []),
                'data' => null,
            ];
        }

        return $this->safeError('API_CLIENT_RESPONSE_ERROR', 'APIリクエストに失敗しました。');
    }

    /**
     * @param array<string, string> $query
     */
    private function buildUrl(string $path, array $query): string
    {
        $url = $this->baseUrl . '/' . ltrim($path, '/');

        if ($query === []) {
            return $url;
        }

        if (function_exists('add_query_arg')) {
            return add_query_arg($query, $url);
        }

        return $url . '?' . http_build_query($query, '', '&', PHP_QUERY_RFC3986);
    }

    private function readSetting(string $optionName, string $envName, string $default): string
    {
        if (function_exists('get_option')) {
            $optionValue = get_option($optionName);

            if (is_string($optionValue) && trim($optionValue) !== '') {
                return trim($optionValue);
            }
        }

        $envValue = getenv($envName);

        if (is_string($envValue) && trim($envValue) !== '') {
            return trim($envValue);
        }

        return $default;
    }

    private function normalizeBaseUrl(string $baseUrl): string
    {
        $baseUrl = trim($baseUrl);

        if ($baseUrl === '') {
            return self::DEFAULT_BASE_URL;
        }

        return rtrim($baseUrl, '/');
    }

    /**
     * @param mixed $decoded
     */
    private function isApiResponse($decoded): bool
    {
        return is_array($decoded)
            && array_key_exists('success', $decoded)
            && is_bool($decoded['success'])
            && array_key_exists('code', $decoded)
            && is_string($decoded['code'])
            && array_key_exists('message', $decoded)
            && is_string($decoded['message']);
    }

    /**
     * @return array<string, mixed>
     */
    private function safeError(string $code, string $message): array
    {
        return [
            'success' => false,
            'code' => $code,
            'message' => $this->sanitizeMessage($message),
            'data' => null,
        ];
    }

    /**
     * @param array<string, mixed> $options
     * @return list<string>
     */
    private function collectSecretValues(array $options): array
    {
        $values = [];

        foreach ([$this->apiKey, $options['license_key'] ?? null] as $value) {
            if (is_string($value) && trim($value) !== '') {
                $values[] = trim($value);
            }
        }

        return array_values(array_unique($values));
    }

    /**
     * @param list<string> $extraSecrets
     */
    private function sanitizeMessage(string $message, array $extraSecrets = []): string
    {
        $message = trim($message);

        foreach (array_merge($this->secretValues, $extraSecrets) as $secretValue) {
            if ($secretValue === '') {
                continue;
            }

            $message = str_replace($secretValue, '[redacted]', $message);
        }

        $message = preg_replace('/LIC-[A-Za-z0-9-]+/', '[redacted]', $message) ?? $message;

        if ($message === '') {
            return 'APIリクエストに失敗しました。';
        }

        if (function_exists('mb_substr')) {
            return mb_substr($message, 0, 200);
        }

        return substr($message, 0, 200);
    }
}
