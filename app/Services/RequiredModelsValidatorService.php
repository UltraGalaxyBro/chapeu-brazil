<?php

namespace App\Services;

class RequiredModelsValidatorService
{
    /**
     * Verifica se todos os modelos necessários possuem pelo menos um registro
     *
     * @param array $requiredModels Associação entre nome do modelo e classe
     * @return array|null Retorna array com os itens faltantes ou null se nenhum faltar
     */
    public function validateModels(array $requiredModels): ?array
    {
        $missingItems = [];
        
        foreach ($requiredModels as $label => $modelClass) {
            if ($modelClass::count() === 0) {
                $missingItems[] = $label;
            }
        }
        
        return !empty($missingItems) ? $missingItems : null;
    }
    
    /**
     * Cria mensagem de erro com os itens faltantes
     *
     * @param array $missingItems Lista de itens faltantes
     * @param string $baseMessage Mensagem base
     * @return string Mensagem completa
     */
    public function createErrorMessage(array $missingItems, string $baseMessage = 'É necessário, de antemão, ter cadastro pelo menos sobre: '): string
    {
        $necessaryText = implode(', ', $missingItems);
        return $baseMessage . $necessaryText;
    }
}