#!/bin/bash

# Script para arreglar el problema de REANIMATED_VERSION_STRING en React Native Reanimated
# Este script debe ejecutarse después de 'pod install'

echo "🔧 Aplicando fix para REANIMATED_VERSION en RNReanimated..."

# Archivos de configuración a modificar
DEBUG_CONFIG="ios/Pods/Target Support Files/RNReanimated/RNReanimated.debug.xcconfig"
RELEASE_CONFIG="ios/Pods/Target Support Files/RNReanimated/RNReanimated.release.xcconfig"

# Función para agregar REANIMATED_VERSION a OTHER_CPLUSPLUSFLAGS
fix_config_file() {
    local config_file="$1"
    local config_type="$2"
    
    if [ -f "$config_file" ]; then
        echo "   Procesando $config_type config..."
        
        # Verificar si ya tiene el fix aplicado
        if grep -q "OTHER_CPLUSPLUSFLAGS.*DREANIMATED_VERSION" "$config_file"; then
            echo "   ✅ $config_type ya tiene el fix aplicado"
        else
            echo "   🔄 Aplicando fix a $config_type..."
            
            # Hacer backup
            cp "$config_file" "$config_file.bak"
            
            # Aplicar fix: agregar -DREANIMATED_VERSION=3.16.7 a OTHER_CPLUSPLUSFLAGS
            sed -i '' 's/\(OTHER_CPLUSPLUSFLAGS = .* -Wno-shorten-64-to-32\)$/\1 -DREANIMATED_VERSION=3.16.7/' "$config_file"
            
            # Verificar que se aplicó correctamente
            if grep -q "OTHER_CPLUSPLUSFLAGS.*DREANIMATED_VERSION" "$config_file"; then
                echo "   ✅ Fix aplicado correctamente a $config_type"
            else
                echo "   ❌ Error aplicando fix a $config_type"
                return 1
            fi
        fi
    else
        echo "   ⚠️  Archivo $config_file no encontrado"
        return 1
    fi
}

# Aplicar fix a ambos archivos de configuración
fix_config_file "$DEBUG_CONFIG" "DEBUG"
fix_config_file "$RELEASE_CONFIG" "RELEASE"

echo "🎉 Fix de REANIMATED_VERSION completado!"
echo "   Ahora puedes compilar el proyecto sin el error de 'Use of undeclared identifier REANIMATED_VERSION_STRING'"
echo ""
echo "💡 Este script debe ejecutarse cada vez que hagas 'pod install'" 