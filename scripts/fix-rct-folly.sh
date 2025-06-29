#!/bin/bash

# Script para aplicar el fix de RCT-Folly char_traits<unsigned char>
# Ejecutar desde la raíz del proyecto: ./scripts/fix-rct-folly.sh

echo "🔧 Aplicando fix para RCT-Folly char_traits<unsigned char>..."

# Verificar que estamos en el directorio correcto
if [ ! -d "ios/Pods/RCT-Folly" ]; then
    echo "❌ Error: No se encontró ios/Pods/RCT-Folly"
    echo "   Asegúrate de ejecutar este script desde la raíz del proyecto"
    echo "   y de haber ejecutado 'pod install' primero"
    exit 1
fi

# Hacer el archivo escribible
chmod +w ios/Pods/RCT-Folly/folly/Range.h

# Verificar si el fix ya está aplicado
if grep -q "char_traits<unsigned char>" ios/Pods/RCT-Folly/folly/Range.h; then
    echo "✅ El fix ya está aplicado en Range.h"
    exit 0
fi

# Crear el archivo de fix temporal
cat > /tmp/char_traits_fix.txt << 'EOF'

// Fix para el problema de char_traits<unsigned char>
namespace std {
  template<>
  struct char_traits<unsigned char> {
    using char_type = unsigned char;
    using int_type = int;
    using off_type = streamoff;
    using pos_type = streampos;
    using state_type = mbstate_t;
    
    static void assign(char_type& c1, const char_type& c2) { c1 = c2; }
    static bool eq(const char_type& c1, const char_type& c2) { return c1 == c2; }
    static bool lt(const char_type& c1, const char_type& c2) { return c1 < c2; }
    
    static int compare(const char_type* s1, const char_type* s2, size_t n) {
      return memcmp(s1, s2, n);
    }
    
    static size_t length(const char_type* s) {
      return strlen(reinterpret_cast<const char*>(s));
    }
    
    static const char_type* find(const char_type* s, size_t n, const char_type& a) {
      return reinterpret_cast<const char_type*>(memchr(s, a, n));
    }
    
    static char_type* move(char_type* s1, const char_type* s2, size_t n) {
      return reinterpret_cast<char_type*>(memmove(s1, s2, n));
    }
    
    static char_type* copy(char_type* s1, const char_type* s2, size_t n) {
      return reinterpret_cast<char_type*>(memcpy(s1, s2, n));
    }
    
    static char_type* assign(char_type* s, size_t n, char_type a) {
      return reinterpret_cast<char_type*>(memset(s, a, n));
    }
    
    static int_type not_eof(const int_type& c) {
      return eq_int_type(c, eof()) ? ~eof() : c;
    }
    
    static char_type to_char_type(const int_type& c) {
      return static_cast<char_type>(c);
    }
    
    static int_type to_int_type(const char_type& c) {
      return static_cast<int_type>(c);
    }
    
    static bool eq_int_type(const int_type& c1, const int_type& c2) {
      return c1 == c2;
    }
    
    static int_type eof() {
      return static_cast<int_type>(EOF);
    }
  };
}

EOF

# Aplicar el fix usando sed para insertar después de #include <folly/lang/Byte.h>
sed -i.bak '/^#include <folly\/lang\/Byte\.h>$/r /tmp/char_traits_fix.txt' ios/Pods/RCT-Folly/folly/Range.h

# Verificar que el fix se aplicó correctamente
if grep -q "char_traits<unsigned char>" ios/Pods/RCT-Folly/folly/Range.h; then
    echo "✅ Fix aplicado correctamente a ios/Pods/RCT-Folly/folly/Range.h"
    echo "   Se creó un backup en Range.h.bak"
else
    echo "❌ Error: No se pudo aplicar el fix automáticamente"
    echo "   Aplica el fix manualmente siguiendo las instrucciones en FIX_COMPILATION_ERRORS.md"
    exit 1
fi

# Limpiar archivo temporal
rm -f /tmp/char_traits_fix.txt

echo "🎉 Fix aplicado exitosamente!"
echo "   Ahora puedes compilar el proyecto en Xcode" 