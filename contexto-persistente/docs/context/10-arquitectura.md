# 10 — Arquitectura

> Cómo está construido. Solo lo que YA existe. Lo planeado va en 50-backlog.md.
> Se actualiza en el mismo commit que el cambio de código.

## Stack
| Capa | Tecnología | Versión | Nota |
|---|---|---|---|
| Framework | | | |
| Base de datos | | | |
| Auth | | | |
| Jobs / colas | | | |
| Email | | | |
| Hosting | | | |
| IA / LLM | | | |

## Estructura de carpetas
```
<!-- Pega aquí un árbol podado (2-3 niveles) con una línea por carpeta
     explicando qué vive ahí. -->
```

## Modelo de datos
<!-- Tablas/colecciones, campos clave, relaciones. O un enlace al schema
     con el commit en que se generó. -->

## Contratos / interfaces
<!-- Endpoints, eventos, webhooks, firmas de funciones que cruzan módulos.
     Esto es lo que más rompe un agente que no lo conoce. -->

## Variables de entorno
| Variable | Para qué | Dónde se obtiene | ¿Requerida? |
|---|---|---|---|
<!-- NUNCA pongas los valores reales aquí. Solo los nombres. -->

## Integraciones externas
<!-- APIs de terceros, límites de rate, cuotas, modo sandbox vs producción. -->

## Cómo se despliega
<!-- Comando, rama, proveedor, qué se corre automáticamente. -->

## Trampas conocidas
<!-- "Esto parece que se puede cambiar pero no." "Este archivo es generado."
     "Esta librería falla si X." Oro puro para el próximo agente. -->
