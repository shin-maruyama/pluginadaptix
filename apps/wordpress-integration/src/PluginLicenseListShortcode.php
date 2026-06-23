<?php

declare(strict_types=1);

namespace PluginAdaptix\WordPressIntegration;

final class PluginLicenseListShortcode
{
    private const SHORTCODE = 'plugin_license_list';
    private const MEMBER_ID_META_KEY = 'pluginadaptix_member_id';
    private const LICENSE_KEYS_META_KEY = 'pluginadaptix_license_keys';
    private const LICENSE_KEY_META_KEY = 'pluginadaptix_license_key';
    private const LICENSE_KEY_META_PREFIX = 'pluginadaptix_license_key_';
    private const DOWNLOAD_ACTION = 'pluginadaptix_download_plugin';
    private const DOWNLOAD_ACTION_FIELD = 'pluginadaptix_action';
    private const DOWNLOAD_PLUGIN_ID_FIELD = 'pluginadaptix_plugin_id';
    private const DOWNLOAD_NONCE_ACTION = 'pluginadaptix_download_plugin';
    private const DOWNLOAD_NONCE_FIELD = 'pluginadaptix_download_nonce';

    private PluginAdaptixApiClient $apiClient;
    private ?string $downloadErrorMessage = null;

    public function __construct(?PluginAdaptixApiClient $apiClient = null)
    {
        $this->apiClient = $apiClient ?? new PluginAdaptixApiClient();
    }

    public static function register(): void
    {
        if (!function_exists('add_shortcode')) {
            return;
        }

        $shortcode = new self();

        if (function_exists('add_action')) {
            add_action('template_redirect', [$shortcode, 'handleDownloadRequest']);
        }

        add_shortcode(self::SHORTCODE, [$shortcode, 'render']);
    }

    public function handleDownloadRequest(): void
    {
        if (!$this->isDownloadRequest()) {
            return;
        }

        if (!$this->isUserLoggedIn()) {
            $this->downloadErrorMessage = 'ログインするとプラグインをダウンロードできます。';
            return;
        }

        if (!$this->verifyDownloadNonce()) {
            $this->downloadErrorMessage = 'ダウンロードリクエストを確認できませんでした。';
            return;
        }

        $memberId = $this->getCurrentMemberId();

        if ($memberId === '') {
            $this->downloadErrorMessage = '会員情報を確認できませんでした。';
            return;
        }

        $pluginId = $this->readPostString(self::DOWNLOAD_PLUGIN_ID_FIELD);

        if ($pluginId === '') {
            $this->downloadErrorMessage = 'ダウンロード対象のプラグインを確認できませんでした。';
            return;
        }

        $licenseKeyResult = $this->findDownloadLicenseKey($memberId, $pluginId);

        if ($licenseKeyResult['licenseKey'] === '') {
            $this->downloadErrorMessage = $licenseKeyResult['message'];
            return;
        }

        $response = $this->apiClient->createDownloadToken(
            $memberId,
            $pluginId,
            $licenseKeyResult['licenseKey']
        );

        if (!$this->isSuccessfulDownloadTokenResponse($response)) {
            $this->downloadErrorMessage = $this->getErrorMessage($response);
            return;
        }

        $downloadUrl = $this->readDownloadUrl($response);

        if ($downloadUrl === '' || !$this->isHttpUrl($downloadUrl)) {
            $this->downloadErrorMessage = 'ダウンロードURLを確認できませんでした。';
            return;
        }

        if ($this->redirectToDownloadUrl($downloadUrl)) {
            exit;
        }

        $this->downloadErrorMessage = 'ダウンロードを開始できませんでした。';
    }

    /**
     * @param mixed $attributes
     */
    public function render($attributes = []): string
    {
        unset($attributes);

        if (!$this->isUserLoggedIn()) {
            return $this->renderNotice('ログインすると利用可能なプラグインを確認できます。', 'info');
        }

        $memberId = $this->getCurrentMemberId();

        if ($memberId === '') {
            return $this->renderNotice('会員情報を確認できませんでした。', 'error');
        }

        $response = $this->apiClient->listPlugins($memberId);

        if (!$this->isSuccessfulPluginListResponse($response)) {
            return $this->renderNotice($this->getErrorMessage($response), 'error');
        }

        /** @var list<array<string, mixed>> $plugins */
        $plugins = $response['data'];

        return $this->renderDownloadMessage() . $this->renderPluginList($plugins);
    }

    private function isUserLoggedIn(): bool
    {
        return function_exists('is_user_logged_in') && is_user_logged_in();
    }

    private function getCurrentMemberId(): string
    {
        if (!function_exists('get_current_user_id')) {
            return '';
        }

        $userId = (int) get_current_user_id();

        if ($userId <= 0) {
            return '';
        }

        if (function_exists('get_user_meta')) {
            $memberId = get_user_meta($userId, self::MEMBER_ID_META_KEY, true);

            if (is_string($memberId) && trim($memberId) !== '') {
                return trim($memberId);
            }
        }

        return (string) $userId;
    }

    private function getCurrentUserId(): int
    {
        if (!function_exists('get_current_user_id')) {
            return 0;
        }

        return (int) get_current_user_id();
    }

    /**
     * @param array<string, mixed> $response
     */
    private function isSuccessfulPluginListResponse(array $response): bool
    {
        return ($response['success'] ?? false) === true
            && isset($response['data'])
            && is_array($response['data']);
    }

    /**
     * @param array<string, mixed> $response
     */
    private function getErrorMessage(array $response): string
    {
        $message = $response['message'] ?? null;

        if (is_string($message) && trim($message) !== '') {
            return trim($message);
        }

        return 'プラグイン一覧を取得できませんでした。';
    }

    /**
     * @param list<array<string, mixed>> $plugins
     */
    private function renderPluginList(array $plugins): string
    {
        if ($plugins === []) {
            return $this->renderNotice('利用可能なプラグインはありません。', 'info');
        }

        $rows = '';

        foreach ($plugins as $plugin) {
            $rows .= sprintf(
                '<tr><td>%s</td><td>%s</td><td>%s</td><td>%s</td></tr>',
                $this->escapeText($this->readString($plugin, 'pluginName')),
                $this->escapeText($this->readString($plugin, 'licenseStatus')),
                $this->escapeText($this->readString($plugin, 'latestVersion')),
                $this->renderDownloadAction($plugin)
            );
        }

        return sprintf(
            '<div class="pluginadaptix-license-list"><table><thead><tr><th>%s</th><th>%s</th><th>%s</th><th>%s</th></tr></thead><tbody>%s</tbody></table></div>',
            $this->escapeText('プラグイン名'),
            $this->escapeText('ライセンス状態'),
            $this->escapeText('最新バージョン'),
            $this->escapeText('操作'),
            $rows
        );
    }

    /**
     * @param array<string, mixed> $plugin
     */
    private function readString(array $plugin, string $key): string
    {
        $value = $plugin[$key] ?? '';

        if (is_string($value) && trim($value) !== '') {
            return trim($value);
        }

        if (is_int($value) || is_float($value)) {
            return (string) $value;
        }

        return '-';
    }

    /**
     * @param array<string, mixed> $plugin
     */
    private function readDownloadAvailable(array $plugin): string
    {
        return ($plugin['downloadAvailable'] ?? false) === true ? '可' : '不可';
    }

    /**
     * @param array<string, mixed> $plugin
     */
    private function renderDownloadAction(array $plugin): string
    {
        if (($plugin['downloadAvailable'] ?? false) !== true) {
            return $this->escapeText($this->readDownloadAvailable($plugin));
        }

        $pluginId = $this->readString($plugin, 'pluginId');

        if ($pluginId === '-') {
            return $this->escapeText('不可');
        }

        return sprintf(
            '<form class="pluginadaptix-download-form" method="post"><input type="hidden" name="%s" value="%s"><input type="hidden" name="%s" value="%s">%s<button type="submit" class="pluginadaptix-download-button">%s</button></form>',
            $this->escapeAttribute(self::DOWNLOAD_ACTION_FIELD),
            $this->escapeAttribute(self::DOWNLOAD_ACTION),
            $this->escapeAttribute(self::DOWNLOAD_PLUGIN_ID_FIELD),
            $this->escapeAttribute($pluginId),
            $this->renderDownloadNonceField(),
            $this->escapeText('ダウンロード')
        );
    }

    private function renderDownloadNonceField(): string
    {
        if (function_exists('wp_nonce_field')) {
            return (string) wp_nonce_field(
                self::DOWNLOAD_NONCE_ACTION,
                self::DOWNLOAD_NONCE_FIELD,
                true,
                false
            );
        }

        return '';
    }

    private function renderDownloadMessage(): string
    {
        if ($this->downloadErrorMessage === null || $this->downloadErrorMessage === '') {
            return '';
        }

        return $this->renderNotice($this->downloadErrorMessage, 'error');
    }

    private function renderNotice(string $message, string $type): string
    {
        $className = $type === 'error' ? 'pluginadaptix-notice-error' : 'pluginadaptix-notice-info';

        return sprintf(
            '<div class="pluginadaptix-license-list-notice %s">%s</div>',
            $this->escapeAttribute($className),
            $this->escapeText($message)
        );
    }

    private function escapeText(string $value): string
    {
        if (function_exists('esc_html')) {
            return esc_html($value);
        }

        return htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
    }

    private function isDownloadRequest(): bool
    {
        return $this->readPostString(self::DOWNLOAD_ACTION_FIELD) === self::DOWNLOAD_ACTION;
    }

    private function verifyDownloadNonce(): bool
    {
        if (!function_exists('wp_verify_nonce')) {
            return false;
        }

        $nonce = $this->readPostString(self::DOWNLOAD_NONCE_FIELD);

        return $nonce !== '' && wp_verify_nonce($nonce, self::DOWNLOAD_NONCE_ACTION) !== false;
    }

    private function readPostString(string $key): string
    {
        $value = $_POST[$key] ?? '';

        if (function_exists('wp_unslash')) {
            $value = wp_unslash($value);
        }

        if (is_array($value)) {
            return '';
        }

        $value = is_scalar($value) ? (string) $value : '';

        if (function_exists('sanitize_text_field')) {
            return sanitize_text_field($value);
        }

        return trim($value);
    }

    /**
     * @return array{licenseKey: string, message: string}
     */
    private function findDownloadLicenseKey(string $memberId, string $pluginId): array
    {
        $contractLicenseKey = $this->findLicenseKeyFromContractStatus($memberId, $pluginId);

        if ($contractLicenseKey['licenseKey'] !== '' || $contractLicenseKey['blocking']) {
            return [
                'licenseKey' => $contractLicenseKey['licenseKey'],
                'message' => $contractLicenseKey['message'],
            ];
        }

        $userMetaLicenseKey = $this->findLicenseKeyFromUserMeta($pluginId);

        if ($userMetaLicenseKey !== '') {
            return [
                'licenseKey' => $userMetaLicenseKey,
                'message' => '',
            ];
        }

        return [
            'licenseKey' => '',
            'message' => $contractLicenseKey['message'] !== ''
                ? $contractLicenseKey['message']
                : 'ライセンスキーを確認できませんでした。',
        ];
    }

    /**
     * @return array{licenseKey: string, message: string, blocking: bool}
     */
    private function findLicenseKeyFromContractStatus(string $memberId, string $pluginId): array
    {
        $response = $this->apiClient->getContractStatus($memberId);

        if (!$this->isSuccessfulContractStatusResponse($response)) {
            return [
                'licenseKey' => '',
                'message' => $this->isBlockingContractError($response) ? $this->getErrorMessage($response) : '',
                'blocking' => $this->isBlockingContractError($response),
            ];
        }

        /** @var array<string, mixed> $data */
        $data = $response['data'];

        if ($this->isExpiredContractData($data)) {
            return [
                'licenseKey' => '',
                'message' => '契約期限が切れているためダウンロードできません。',
                'blocking' => true,
            ];
        }

        $licenses = $data['licenses'] ?? [];

        if (!is_array($licenses)) {
            return [
                'licenseKey' => '',
                'message' => 'ライセンス情報を確認できませんでした。',
                'blocking' => false,
            ];
        }

        foreach ($licenses as $license) {
            if (!is_array($license) || $this->readString($license, 'pluginId') !== $pluginId) {
                continue;
            }

            if ($this->isExpiredLicenseData($license)) {
                return [
                    'licenseKey' => '',
                    'message' => 'ライセンス期限が切れているためダウンロードできません。',
                    'blocking' => true,
                ];
            }

            if (!$this->isActiveStatus($this->readString($license, 'status'))) {
                return [
                    'licenseKey' => '',
                    'message' => 'ライセンスが有効ではないためダウンロードできません。',
                    'blocking' => true,
                ];
            }

            $licenseKey = $this->readString($license, 'licenseKey');

            return [
                'licenseKey' => $licenseKey === '-' ? '' : $licenseKey,
                'message' => $licenseKey === '-' ? 'ライセンスキーを確認できませんでした。' : '',
                'blocking' => false,
            ];
        }

        return [
            'licenseKey' => '',
            'message' => '対象プラグインのライセンスを確認できませんでした。',
            'blocking' => false,
        ];
    }

    private function findLicenseKeyFromUserMeta(string $pluginId): string
    {
        $userId = $this->getCurrentUserId();

        if ($userId <= 0 || !function_exists('get_user_meta')) {
            return '';
        }

        $licenseKeys = get_user_meta($userId, self::LICENSE_KEYS_META_KEY, true);
        $licenseKey = $this->readLicenseKeyFromMap($licenseKeys, $pluginId);

        if ($licenseKey !== '') {
            return $licenseKey;
        }

        $pluginSpecificKey = get_user_meta(
            $userId,
            self::LICENSE_KEY_META_PREFIX . $this->normalizeMetaKeySuffix($pluginId),
            true
        );

        if (is_string($pluginSpecificKey) && trim($pluginSpecificKey) !== '') {
            return trim($pluginSpecificKey);
        }

        $singleLicenseKey = get_user_meta($userId, self::LICENSE_KEY_META_KEY, true);

        if (is_string($singleLicenseKey) && trim($singleLicenseKey) !== '') {
            return trim($singleLicenseKey);
        }

        return '';
    }

    /**
     * @param mixed $licenseKeys
     */
    private function readLicenseKeyFromMap($licenseKeys, string $pluginId): string
    {
        if (is_string($licenseKeys)) {
            $decoded = json_decode($licenseKeys, true);
            $licenseKeys = is_array($decoded) ? $decoded : [];
        }

        if (!is_array($licenseKeys)) {
            return '';
        }

        $value = $licenseKeys[$pluginId] ?? null;

        if (is_string($value) && trim($value) !== '') {
            return trim($value);
        }

        return '';
    }

    private function normalizeMetaKeySuffix(string $pluginId): string
    {
        if (function_exists('sanitize_key')) {
            return sanitize_key($pluginId);
        }

        return strtolower((string) preg_replace('/[^A-Za-z0-9_-]/', '', $pluginId));
    }

    /**
     * @param array<string, mixed> $response
     */
    private function isSuccessfulDownloadTokenResponse(array $response): bool
    {
        return ($response['success'] ?? false) === true
            && isset($response['data'])
            && is_array($response['data'])
            && isset($response['data']['downloadUrl'])
            && is_string($response['data']['downloadUrl']);
    }

    /**
     * @param array<string, mixed> $response
     */
    private function isSuccessfulContractStatusResponse(array $response): bool
    {
        return ($response['success'] ?? false) === true
            && isset($response['data'])
            && is_array($response['data']);
    }

    /**
     * @param array<string, mixed> $response
     */
    private function isBlockingContractError(array $response): bool
    {
        $code = $response['code'] ?? '';

        return in_array($code, ['CONTRACT_EXPIRED', 'LICENSE_EXPIRED', 'LICENSE_SUSPENDED'], true);
    }

    /**
     * @param array<string, mixed> $response
     */
    private function readDownloadUrl(array $response): string
    {
        $data = $response['data'] ?? null;

        if (!is_array($data)) {
            return '';
        }

        $downloadUrl = $data['downloadUrl'] ?? '';

        return is_string($downloadUrl) ? trim($downloadUrl) : '';
    }

    /**
     * @param array<string, mixed> $data
     */
    private function isExpiredContractData(array $data): bool
    {
        if (!$this->isActiveStatus($this->readString($data, 'contractStatus'))) {
            return true;
        }

        return $this->isPastDate($this->readString($data, 'contractEndDate'));
    }

    /**
     * @param array<string, mixed> $data
     */
    private function isExpiredLicenseData(array $data): bool
    {
        if ($this->isExpiredStatus($this->readString($data, 'status'))) {
            return true;
        }

        return $this->isPastDate($this->readString($data, 'expireDate'));
    }

    private function isActiveStatus(string $status): bool
    {
        return in_array($status, ['active', 'ACTIVE', '有効'], true);
    }

    private function isExpiredStatus(string $status): bool
    {
        return in_array($status, ['expired', 'EXPIRED', '期限切れ'], true);
    }

    private function isPastDate(string $dateValue): bool
    {
        if ($dateValue === '' || $dateValue === '-') {
            return false;
        }

        $timestamp = strtotime($dateValue . ' 23:59:59');

        return $timestamp !== false && $timestamp < time();
    }

    private function isHttpUrl(string $url): bool
    {
        if (filter_var($url, FILTER_VALIDATE_URL) === false) {
            return false;
        }

        $scheme = parse_url($url, PHP_URL_SCHEME);

        return in_array($scheme, ['http', 'https'], true);
    }

    private function redirectToDownloadUrl(string $downloadUrl): bool
    {
        $url = function_exists('esc_url_raw') ? esc_url_raw($downloadUrl) : $downloadUrl;

        if (function_exists('nocache_headers')) {
            nocache_headers();
        }

        if (function_exists('wp_redirect')) {
            return wp_redirect($url, 302, 'PluginAdaptix') !== false;
        }

        if (!headers_sent()) {
            header('Location: ' . $url, true, 302);
            return true;
        }

        return false;
    }

    private function escapeAttribute(string $value): string
    {
        if (function_exists('esc_attr')) {
            return esc_attr($value);
        }

        return htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
    }
}
