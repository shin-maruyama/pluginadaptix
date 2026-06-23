<?php

/**
 * Plugin Name: PluginAdaptix WordPress Integration
 * Description: WordPress integration for PluginAdaptix license and plugin APIs.
 * Version: 0.1.0
 * Author: PluginAdaptix
 */

declare(strict_types=1);

namespace PluginAdaptix\WordPressIntegration;

require_once __DIR__ . '/src/PluginAdaptixApiClient.php';
require_once __DIR__ . '/src/PluginLicenseListShortcode.php';

add_action('init', static function (): void {
    PluginLicenseListShortcode::register();
});
