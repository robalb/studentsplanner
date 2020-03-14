<?php

class LanguageManager{
  //the user locale, value set in the constructor.
  //if this value is set to false, methods that require the locale
  //will not work
  private $locale;
  //the path to the json file containing all the languages
  private $languagesJsonPath;
  //the path to the folder containing all the translations
  private $languagesFolderPath;

  public function __construct(string $currentLocale){
    if($currentLocale === "false") $currentLocale = false;
    $this->locale = $currentLocale;

    $this->languagesJsonPath = dirname(__FILE__) . "/../i18n/languages.json";
    $this->languagesFolderPath = dirname(__FILE__) . "/../i18n/languages/";
  }

  public function updateLocale(string $locale){
    $this->locale = $locale;
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

  public function getNegotiatedUserLocale(){
    //get an array containing all the accepted languages
    $accepted = $this->parseLanguageList($_SERVER['HTTP_ACCEPT_LANGUAGE']);

    //get an array containing all the supported languages
    $languagesJson =  $this->getLanguagesJson();
    $languages = json_decode($languagesJson, true, 3);
    $available = $this->parseLanguageList($languages["supportedLanguages"]);

    //find a match between the two arrays, and return it
    $matches = $this->findMatches($accepted, $available);
    if(count($matches) < 1){
      return $languages["default"];
    }
    return reset($matches)[0];
  }

  public function getUserLanguageJson(){
    if(!$this->locale){
      throw new \Exception('locale not defined');
    }
    $locale = $this->locale;
    $filePath = $this->languagesFolderPath . "$locale.json";
    $stringJson = file_get_contents($filePath);
    if(strlen($stringJson) < 2){
      return "{}";
    }
    return $stringJson;
  }

}
