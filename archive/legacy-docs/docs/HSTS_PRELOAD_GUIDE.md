# Guía de HSTS Preload

## ¿Qué es?

HTTP Strict Transport Security (HSTS) obliga a los navegadores a usar HTTPS. El programa **HSTS Preload** mantiene una lista (Chrome, Firefox, Edge, Safari) de dominios que **nunca** deben intentar HTTP. Una vez dentro, los navegadores omiten por completo cualquier intento de downgrade.

## Requisitos para entrar en la lista

1. Certificado TLS válido en dominio raíz **y** subdominios.
2. Redirección 301 permanente de `http://` a `https://`.
3. Header HSTS con:
   - `max-age >= 31536000`
   - `includeSubDomains`
   - `preload`
4. No servir contenido mixto ni subdominios inseguros.

## Checklist de verificación

```bash
# SSL correcto
openssl s_client -connect purezanaturalis.com:443 -servername purezanaturalis.com | grep 'Verify return code'

# Redirecciones HTTP -> HTTPS
curl -I http://purezanaturalis.com
curl -I http://www.purezanaturalis.com

# Header HSTS completo
curl -I https://purezanaturalis.com | grep -i strict
```

El resultado debe contener:

```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

## Envío a hstspreload.org

1. Visitar https://hstspreload.org/.
2. Ingresar dominio (`purezanaturalis.com`).
3. Resolver los checks (verde).
4. Confirmar checkboxes de permanencia.
5. Enviar.

**Timeline**:

- Chrome estable: 2‑3 meses.
- Otros navegadores: +2 meses.
- Remoción: 3‑12 meses (no garantizada).

## Cuándo NO enviarlo

- Entornos staging.
- Sitios con subdominios legacy sin HTTPS.
- Migraciones en curso.

Mientras tanto, mantener HSTS sin `preload` hasta estar 100 % seguros.

## Rollback

Si ya estás en la lista y necesitas salir:

1. Cambiar header a `max-age=0`.
2. Esperar a que los navegadores olviden la política (puede tardar meses).
3. Solicitar remoción en hstspreload.org.
4. Esperar a que se propague (3‑12 meses).

**Conclusión**: enviar a preload solo cuando la plataforma esté estable y HTTPS sea irreversible.
