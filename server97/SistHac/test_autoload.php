<?php

require __DIR__ . '/vendor/autoload.php';

if (class_exists(\PHPJasper\PHPJasper::class)) {
    echo "Jasper OK";
} else {
    echo "Jasper NO";
}