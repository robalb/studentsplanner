<?php

class LanguageManager{
  //the path to the json file containing all the languages
  private $languagesJsonPath;
  //the path to the folder containing all the translations
  private $languagesFolderPath;
  //the path to the folder containing all the server side translations
  private $serverLanguagesFolderPath;

  //the current locale
  private $locale;

  public function __construct(){
    $this->languagesJsonPath = dirname(__FILE__) . "/../i18n/languages.json";
    $this->languagesFolderPath = dirname(__FILE__) . "/../i18n/languages/";
    $this->serverLanguagesFolderPath = dirname(__FILE__) . "/../i18n/serverLanguages/";
  }

  /* https://stackoverflow.com/questions/3770513/detect-browser-language-in-php */
  /* https://github.com/willdurand/Negotiation */
  /* https://www.php.net/manual/en/locale.lookup.php */
  // parse list of comma separated language tags and sort it by the quality value
  private function parseLanguageList($languageList) {
    if (is_null($languageList)) {
      return array();
    }
    $languages = array();
    if(is_array($languageList)){
      $languageRanges = $languageList;
    }else{
      $languageRanges = explode(',', trim($languageList));
    }
    foreach ($languageRanges as $languageRange) {
      if (preg_match('/(\*|[a-zA-Z0-9]{1,8}(?:-[a-zA-Z0-9]{1,8})*)(?:\s*;\s*q\s*=\s*(0(?:\.\d{0,3})|1(?:\.0{0,3})))?/', trim($languageRange), $match)) {
        if (!isset($match[2])) {
          $match[2] = '1.0';
        } else {
          $match[2] = (string) floatval($match[2]);
        }
        if (!isset($languages[$match[2]])) {
          $languages[$match[2]] = array();
        }
        $languages[$match[2]][] = strtolower($match[1]);
      }
    }
    krsort($languages);
    return $languages;
  }

  // compare two parsed arrays of language tags and find the matches
  private function findMatches($accepted, $available) {
    $matches = array();
    $any = false;
    foreach ($accepted as $acceptedQuality => $acceptedValues) {
      $acceptedQuality = floatval($acceptedQuality);
      if ($acceptedQuality === 0.0) continue;
      foreach ($available as $availableQuality => $availableValues) {
        $availableQuality = floatval($availableQuality);
        if ($availableQuality === 0.0) continue;
        foreach ($acceptedValues as $acceptedValue) {
          if ($acceptedValue === '*') {
            $any = true;
          }
          foreach ($availableValues as $availableValue) {
            $matchingGrade = $this->matchLanguage($acceptedValue, $availableValue);
            if ($matchingGrade > 0) {
              $q = (string) ($acceptedQuality * $availableQuality * $matchingGrade);
              if (!isset($matches[$q])) {
                $matches[$q] = array();
              }
              if (!in_array($availableValue, $matches[$q])) {
                $matches[$q][] = $availableValue;
              }
            }
          }
        }
      }
    }
    if (count($matches) === 0 && $any) {
      $matches = $available;
    }
    krsort($matches);
    return $matches;
  }

  // compare two language tags and distinguish the degree of matching
  private function matchLanguage($a, $b) {
    $a = explode('-', $a);
    $b = explode('-', $b);
    for ($i=0, $n=min(count($a), count($b)); $i<$n; $i++) {
      if ($a[$i] !== $b[$i]) break;
    }
    return $i === 0 ? 0 : (float) $i / count($a);
  }

  public function getLanguagesJson(){
    $stringJson = file_get_contents($this->languagesJsonPath);
    return $stringJson;
  }

  public function setServersideLocale(string $locale){
    $this->locale = $locale;
  }

  //only simple key strings are supported for now;
  public function t(string $key){
    //negotiate the current locale
    if(!$this->locale){
      //try to get the session locale
      if(isset($_SESSION['locale']) && strlen($_SESSION['locale']) > 0){
        $this->locale = $_SESSION['locale'];
      }
      //try to get the browser locale, or use the default
      $this->locale = $this->getNegotiatedUserLocale();
    }
    //get the server languages array
    $locale = $this->locale;
    $file = file_get_contents($this->serverLanguagesFolderPath . "$locale.json");
    $decoded = json_decode($file, true);
    //get the key
    if(isset($decoded[$key])){
      return $decoded[$key];
    }
    //fallback to the key itself
    return $key;
  }

  public function getT(){
    $t = function($key){
      echo $this->t($key);
    };
    return $t;
  }

  public function getNegotiatedUserLocale(){
    if($this->locale){
      return $this->locale;
    }
    //get an array containing all the accepted languages
    $accepted = $this->parseLanguageList($_SERVER['HTTP_ACCEPT_LANGUAGE']);

    //get an array containing all the supported languages
    $languagesJson =  $this->getLanguagesJson();
    $languages = json_decode($languagesJson, true, 3);
    $available = $this->parseLanguageList($languages["supportedLanguages"]);

    //find a match between the two arrays, and return it
    $matches = $this->findMatches($accepted, $available);
    if(count($matches) < 1){
      $this->locale = $languages["default"];
    }else{
      $this->locale = reset($matches)[0];
    }
    return $this->locale;
  }

  public function getUserLanguageJson(string $locale){
    $filePath = $this->languagesFolderPath . "$locale.json";
    $stringJson = file_get_contents($filePath);
    if(strlen($stringJson) < 2){
      return "{}";
    }
    return $stringJson;
  }

}
