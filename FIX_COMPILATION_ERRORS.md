# Fix para Errores de Compilación - PathFinder iOS

## Error #1: RCT-Folly `std::char_traits<unsigned char>` 

### Descripción del Problema
```
Implicit instantiation of undefined template 'std::char_traits<unsigned char>'
in file included from /ios/Pods/RCT-Folly/folly/json_pointer.cpp:17:
in file included from /ios/Pods/RCT-Folly/folly/json_pointer.h:19:
```

### Causa
El compilador de C++ no tiene una especialización definida para `std::char_traits<unsigned char>`, que es requerida por algunas funciones de Folly que manejan arrays de bytes.

### Solución Aplicada
Se agregó una especialización completa de `char_traits<unsigned char>` en el archivo:
**Archivo**: `ios/Pods/RCT-Folly/folly/Range.h`

**Ubicación del cambio**: Después de los includes, antes del namespace folly (línea ~68)

**Código agregado**:
```cpp
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
```

### Pasos para Replicar el Fix

1. **Hacer el archivo escribible**:
   ```bash
   cd ios
   chmod +w Pods/RCT-Folly/folly/Range.h
   ```

2. **Abrir el archivo**: `ios/Pods/RCT-Folly/folly/Range.h`

3. **Localizar la línea**: Buscar después de los includes y antes de:
   ```cpp
   // Ignore shadowing warnings within this file, so includers can use -Wshadow.
   FOLLY_PUSH_WARNING
   FOLLY_GNU_DISABLE_WARNING("-Wshadow")
   
   namespace folly {
   ```

4. **Insertar el código** de la especialización `char_traits<unsigned char>` mostrado arriba

### Cuándo Aplicar este Fix
- Después de cada `pod install` (los cambios se pierden)
- Si aparece el error de compilación relacionado con `char_traits<unsigned char>`
- Al configurar el proyecto en una nueva máquina

### Contexto Técnico
- **Versión React Native**: 0.74.5
- **Versión RCT-Folly**: La que viene con React Native 0.74.5
- **Compilador**: C++20 (configurado en Podfile)
- **Plataforma**: iOS (arm64, simulador)

### Configuraciones Adicionales en Podfile
Además de este fix, se configuró C++20 en el Podfile:
```ruby
config.build_settings['CLANG_CXX_LANGUAGE_STANDARD'] = 'c++20'
config.build_settings['OTHER_CPLUSPLUSFLAGS'] = '-std=c++20'
```

---

## Error #2: REANIMATED_VERSION_STRING no declarado

### Descripción del Problema
```
Use of undeclared identifier 'REANIMATED_VERSION_STRING'
in ReanimatedVersion.cpp
```

### Causa
La macro `REANIMATED_VERSION` está definida en `OTHER_CFLAGS` pero no en `OTHER_CPLUSPLUSFLAGS`, causando que los archivos `.cpp` de Reanimated no puedan compilar.

### Solución Aplicada
Se agregó `-DREANIMATED_VERSION=3.16.7` a las configuraciones de C++ en los archivos:
- `ios/Pods/Target Support Files/RNReanimated/RNReanimated.debug.xcconfig`
- `ios/Pods/Target Support Files/RNReanimated/RNReanimated.release.xcconfig`

**Cambio específico**:
```xcconfig
OTHER_CPLUSPLUSFLAGS = $(inherited) ... -DREANIMATED_VERSION=3.16.7
```

### Script Automático
Creado script `scripts/fix-reanimated-version.sh` que:
- Detecta si el fix ya está aplicado
- Aplica el cambio automáticamente
- Hace backup de los archivos originales

---

## Scripts Automáticos

Para facilitar la aplicación de estos fixes cada vez que ejecutes `pod install`:

```bash
# Ejecutar ambos fixes después de pod install
./scripts/fix-rct-folly.sh && ./scripts/fix-reanimated-version.sh
```

---

## Próximos Errores Potenciales

### Error #3: AgoraRtcEngine_iOS
- **Tipo**: `Command PhaseScriptExecution failed with a nonzero exit code`
- **Estado**: Pendiente de resolución
- **Causa probable**: Problemas con scripts de build de Agora

### Otros Posibles Errores
- Firebase/Google Services configuración
- Mapbox tokens de API
- Signing y certificados de iOS
- Permisos en Info.plist

---

**Fecha del fix**: $(date)
**Aplicado por**: Equipo de desarrollo
**Verificado**: ✅ Resuelve el error de compilación de RCT-Folly 