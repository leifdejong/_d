<?php
  /**
   * Pick files from a directory
   * - read files and extract the filename based on the extension
   *
   * @package _d
   */
  function pick($directory, $ext) {
    $files = new DirectoryIterator(get_template_directory() . $directory);
    $paths = array();
    foreach ($files as $file) {
      if (pathinfo($file, PATHINFO_EXTENSION) === $ext) {
        array_push($paths, basename($file));
      }
    }
    return reorder($paths);
  }

  /**
   * Search array for an element containing a substring
   *
   * @package _d
   */
  function search($array, $substring) {
    return array_values(array_filter($array, function($var) use ($substring) {
      return preg_match("/\b$substring\b/i", $var);
    }));
  }

  /**
   * Reorder paths based on the following rules:
   * - entries with "index" should be the first element
   * - entries with "vendor" should be the last element
   *
   * @package _d
   */
  function reorder($array) {
    $index = search($array, 'index');
    $vendor = search($array, 'vendor');

    if (!empty($index)) {
      array_unshift($array, $index[0]);
    }
    
    if (!empty($vendor)) {
      array_push($array, $vendor[0]);
    }

    return array_unique($array);
  }

  /**
   * Enqueues scripts and styles
   * - loads files from build directory
   * - fixes asset loading order
   * - resolves loading chunks by page type
   * - handles chunk hashing for produciton
   *
   * @package _d
   */
  function enqueue() {
    $scripts_path = '/dist/js/';
    $styles_path = '/dist/css/';
    $scripts = pick($scripts_path, 'js');
    $styles = pick($styles_path, 'css');
    $assets = array_merge($scripts, $styles);

    foreach ($assets as $asset) {
      $filename = basename($asset);
      $parts = explode('.', $filename);
      $has_hash = (count($parts) == 3 ? true : false);

      if ($has_hash) {
        list($name, $hash, $ext) = $parts;
      } else {
        list($name, $ext) = $parts;
      }

      switch(true) {
        case ($name == 'home' && !is_front_page()) : 
          break;

        case ($name == 'page' && !is_page()) :
          break;

        case ($name == 'post' && !is_single()) :
          break;

        case ($name == 'archive' && !is_archive()) :
          break;

        default:
          if ($ext == 'js') {
            wp_enqueue_script(
              $name,
              get_template_directory_uri() . $scripts_path . $filename,
              array(),
              ($has_hash ? $hash : false),
              true
            );
          }
    
          if ($ext == 'css') {
            wp_enqueue_style(
              $name,
              get_template_directory_uri() . $styles_path . $filename,
              array(),
              ($has_hash ? $hash : false),
              'all'
            );
          }
          break;
      }
    }
  }
  add_action( 'wp_enqueue_scripts', 'enqueue' );
