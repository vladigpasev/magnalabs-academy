<?php

use GoogleTranslate\Client;

require_once dirname(__DIR__) . "/vendor/autoload.php";

define("GOOGLE_API_KEY", "AIzaSyDe8Ojy4Ab0SFoS90eRgGUv42wNIzACPq4");

$locales = ["bg", "en", "fr", "de"];

$validOperationTypes = ["INIT", "UPDATE"];

if (!isset($argv["1"])) {
    throw new Exception("Please define operation type: " . implode(" | ", $validOperationTypes));
}

if (!in_array($argv["1"], $validOperationTypes)) {
    throw new Exception("Valid operation types are: " . implode(" | ", $validOperationTypes));
}

$operationType = $argv["1"];

if (isset($argv["2"]) && !in_array($argv["2"], $locales)) {
    throw new Exception("Valid locales are: " . implode(" | ", $locales));
}

$locale = isset($argv["2"]) ? $argv["2"] : null;

$localesToTranslateTo = [];

if ($locale) {
    $localesToTranslateTo[] = $locale;
} else {
    $localesToTranslateTo = $locales;
}

$enMessages = json_decode(preg_replace('/[\x00-\x1F\x80-\xFF]/', '', file_get_contents(dirname(__DIR__) . "/../../src/translations/en.json")), true);
$counter = 0;

file_put_contents(dirname(__DIR__) . "/../../src/translations/en.json", json_encode($enMessages, JSON_PRETTY_PRINT|JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES));

foreach ($localesToTranslateTo as $localeToTranslateTo) {
    if ($localeToTranslateTo == "en") {
        continue;
    }

    switch ($operationType) {
        case "INIT":
            $localeMessages = [];
            $messagesToTranslate = $enMessages;
            break;
        case "UPDATE":
            $localeMessages = json_decode(file_get_contents(dirname(__DIR__) . "/../../src/translations/" . $localeToTranslateTo . ".json"), true);
            $messagesToTranslate = array_diff_key_recursive($enMessages, $localeMessages);
            break;
        default:
            throw new Exception("This must never happens");
    }

    array_walk_recursive($messagesToTranslate, "updateMessage", [
        "fromLanguage" => "en",
        "toLanguage" => $localeToTranslateTo,
        "counter" => $counter
    ]);

    $localeMessages = array_merge_recursive($localeMessages, $messagesToTranslate);

    file_put_contents(dirname(__DIR__) . "/../../src/translations/" . $localeToTranslateTo . ".json", json_encode($localeMessages, JSON_PRETTY_PRINT|JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES));
}

function updateMessage(&$message, $key, $settings)
{
    $counter = $settings["counter"];

    if (!isStringUrl($message) &&
        !isStringEmail($message) &&
        strpos($message, "fas ") === false &&
        strpos($message, "far ") === false &&
        strpos($message, "fal ") === false &&
        strpos($message, "fad ") === false &&
        strpos($message, "fab ") === false) {
        $fromLanguage = $settings["fromLanguage"];
        $toLanguage = $settings["toLanguage"];

        sleep(5);

        $message = translate($message, $fromLanguage, $toLanguage);
    }

    $settings["counter"]++;
}

function translate($message, $fromLanguage, $toLanguage)
{
    $client = new Client(GOOGLE_API_KEY);

    $ifStartsWithCapital = preg_match("~^\p{Lu}~u", $message);

    $translatedMessage = $client->translate($message, $toLanguage, $fromLanguage);

    if ($ifStartsWithCapital) {
        $translatedMessage = ucfirst($translatedMessage);
    }

    var_dump($message . " => " . $translatedMessage);

    return $translatedMessage;
}

function array_diff_key_recursive(array $arr1, array $arr2)
{
    $diff = array_diff_key($arr1, $arr2);
    $intersect = array_intersect_key($arr1, $arr2);

    foreach ($intersect as $k => $v) {
        if (is_array($arr1[$k]) && is_array($arr2[$k])) {
            $d = array_diff_key_recursive($arr1[$k], $arr2[$k]);

            if ($d) {
                $diff[$k] = $d;
            }
        }
    }

    return $diff;
}

function isStringUrl($url)
{
    return preg_match("/\b(?:(?:https?|ftp):\/\/|www\.)[-a-z0-9+&@#\/%?=~_|!:,.;]*[-a-z0-9+&@#\/%=~_|]/i", $url);
}

function isStringEmail($email)
{
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}
