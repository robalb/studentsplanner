<?php

class BundlesManager{
  private $bundles;
  private $bundlesPath;
  private $stats;

  function __construct(string $entryName = null, string $bundlesPath = './', string $position = 'BODY'){
    //init bundles array
    $this->bundles = [
      'HEAD' => [],
      'BODY' => []
    ];
    //validate parameters
    if(!$entryName){
      throw new \Exception('Invalid bundle entryName');
    }
    if($position !== 'BODY' && $position !== 'HEAD'){
      throw new \Exception('Invalid position parameter');
    }
    //try to import the json file containing the bundle stats
    $jsonStats = file_get_contents( $bundlesPath . 'stats.json');
    if($jsonStats == null){
      throw new \Exception("couldn't read stats file at the given path");
    }
    $decodedStats = json_decode($jsonStats, true);
    if($decodedStats == null){
      throw new \Exception("couldn't decode stats file at the given path");
    }
    $this->stats = $decodedStats;
    //call the import method
    $this->import($entryName, $bundlesPath, $position);
  }

  private function import(string $entryName, string $bundlesPath, string $position){
    if($bundlesPath) $this->bundlesPath = $bundlesPath;

    //read the stats json and get all the bundles associated to the given entrypoint name
    $parseError = 0;
    if(!array_key_exists('entrypoints', $this->stats)){
      $parseError = 1;
    }
    else if(!array_key_exists($entryName, $this->stats['entrypoints'])){
      $parseError = 2;
    }
    else if(!array_key_exists('assets', $this->stats['entrypoints'][$entryName])){
      $parseError = 3;
    }
    else if(count($this->stats['entrypoints'][$entryName]['assets']) == 0){
      $parseError = 4;
    }
    if($parseError){
      throw new \Exception("couldn't parse the stats file. Error: $parseError");
      return false;
    }

    $this->bundles[$position] = $this->stats['entrypoints'][$entryName]['assets'];
  }

  public function headOutput(){
  }

  public function bodyOutput(){
    $bodyBundles = $this->bundles['BODY'];
    //generate import html tags for the bundles
    $bundlesImportTags = "";
    foreach($bodyBundles as $bundleName){
      $bundlePath = $this->bundlesPath . $bundleName;
      $bundlesImportTags .= "<script src=\"$bundlePath\"></script>";
    }

    echo($bundlesImportTags);

  }
}
