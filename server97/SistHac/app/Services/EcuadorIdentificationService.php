<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class EcuadorIdentificationService
{
    /**
     * Valida algorítmicamente una cédula ecuatoriana (10 dígitos).
     * 
     * @param string $cedula
     * @return bool
     */
    public function validateCedulaAlgorithmic(string $cedula): bool
    {
        if (strlen($cedula) !== 10 || !is_numeric($cedula)) {
            return false;
        }

        $province = (int)substr($cedula, 0, 2);
        if (($province < 1 || $province > 24) && $province !== 30) {
            return false;
        }

        $thirdDigit = (int)$cedula[2];
        if ($thirdDigit >= 6) {
            return false;
        }

        $digits = str_split($cedula);
        $checksum = (int)array_pop($digits);
        $sum = 0;

        foreach ($digits as $key => $digit) {
            $val = (int)$digit;
            if ($key % 2 === 0) { // Posiciones impares (1, 3, 5, 7, 9) -> peso 2
                $p = $val * 2;
                $sum += ($p > 9) ? ($p - 9) : $p;
            } else { // Posiciones pares (2, 4, 6, 8) -> peso 1
                $sum += $val;
            }
        }

        $verificador = ($sum % 10 === 0) ? 0 : (10 - ($sum % 10));

        return $verificador === $checksum;
    }

    /**
     * Consulta los datos de un ciudadano en el SRI.
     * 
     * @param string $cedula
     * @return array|null [full_name, exists]
     */
    public function getSriData(string $cedula): ?array
    {
        try {
            // Intentamos consultar al endpoint público de RUC del SRI (funciona para personas con RUC y a veces trae nombres de cédula)
            // Nota: El SRI suele bloquear peticiones automatizadas, se usa un User-Agent común.
            // Desactivamos verificación SSL (verify(false)) para evitar errores de certificado en ambientes locales (WAMP/XAMPP)
            $endpoints = [
                "https://srienlinea.sri.gob.ec/sri-en-linea-v1.0/consultarRuc/consultar/consolidado/" . $cedula . "001",
                "https://srienlinea.sri.gob.ec/movil-servicios/consultas/ruc/consultarPorNumeroRuc?numeroRuc=" . $cedula . "001",
                "https://srienlinea.sri.gob.ec/sri-en-linea-v1.0/consultarRuc/consultar/razonSocial/" . $cedula . "001"
            ];

            $fullName = null;

            foreach ($endpoints as $url) {
                try {
                    $response = Http::withHeaders([
                        'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                        'Accept' => 'application/json, text/plain, */*',
                        'Referer' => 'https://srienlinea.sri.gob.ec/',
                        'Origin' => 'https://srienlinea.sri.gob.ec',
                    ])->withoutVerifying()->timeout(4)->get($url);

                    if ($response->successful() && $response->json()) {
                        $data = $response->json();
                        $fullName = $data['razonSocial'] ?? $data['nombreComercial'] ?? null;
                        
                        if (!$fullName && isset($data['contribuyente'])) {
                            $fullName = $data['contribuyente']['razonSocial'] ?? $data['contribuyente']['nombreComercial'] ?? null;
                        }

                        if ($fullName) break; 
                    }
                } catch (\Exception $inner) {
                    continue;
                }
            }

            return [
                'exists' => !empty($fullName),
                'full_name' => $fullName ? mb_convert_case($fullName, MB_CASE_UPPER, "UTF-8") : null,
                'source' => $fullName ? 'SRI' : 'N/A'
            ];

        } catch (\Exception $e) {
            Log::warning("Error al consultar SRI para cédula {$cedula}: " . $e->getMessage());
            return null;
        }
    }
}
