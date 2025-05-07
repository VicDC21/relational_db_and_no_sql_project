import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Datos, DatosNoSQL
from django.views.decorators.http import require_http_methods
from django.shortcuts import render
from django.conf import settings

def handle_crud_operation(model, model_type, request, pk=None, operation='get'):
    try:
        if model_type == 'sql':
            if operation == 'get_all':
                datos = model.objects.all()
                return list(datos.values())
            elif operation == 'get':
                return model.objects.get(pk=pk)
            elif operation == 'create':
                data = json.loads(request.body)
                dato = model.objects.create(**data)
                return {'id': dato.id, **{field: getattr(dato, field) for field in data}}
            elif operation == 'update':
                data = json.loads(request.body)
                dato = model.objects.get(pk=pk)
                for key, value in data.items():
                    setattr(dato, key, value)
                dato.save()
                return {'id': dato.id, **{field: getattr(dato, field) for field in data}}
            elif operation == 'delete':
                dato = model.objects.get(pk=pk)
                dato.delete()
                return {'message': 'Nota de alumno eliminada correctamente'}
        
        elif model_type == 'nosql':
            nosql_handler = DatosNoSQL(model)
            
            if operation == 'get_all':
                datos = nosql_handler.get_all()
                for dato in datos:
                    dato['_id'] = str(dato['_id'])
                return datos
            elif operation == 'get':
                dato = nosql_handler.get_by_id(pk)
                if dato:
                    dato['_id'] = str(dato['_id'])
                    return dato
            elif operation == 'create':
                data = json.loads(request.body)
                metadata = data.get('metadata', {}) if isinstance(data.get('metadata'), dict) else {}
                
                documento = nosql_handler.create(
                    nombre=data['nombre'],
                    descripcion=data['descripcion'],
                    valor=data['valor'],
                    metadata=metadata
                )
                documento_guardado = nosql_handler.save(documento)
                documento_guardado['_id'] = str(documento_guardado['_id'])
                return documento_guardado
            elif operation == 'update':
                data = json.loads(request.body)
                nosql_handler = DatosNoSQL(model)
                documento = nosql_handler.get_by_id(pk)
                
                if not documento:
                    return None
                
                metadata = data.get('metadata', {})
                if not isinstance(metadata, dict):
                    metadata = {}
                
                documento['nombre'] = data['nombre']
                documento['descripcion'] = data['descripcion']
                documento['valor'] = data['valor']
                documento['metadata'] = metadata
                
                documento_actualizado = nosql_handler.save(documento)
                documento_actualizado['_id'] = str(documento_actualizado['_id'])
                return documento_actualizado
            elif operation == 'delete':
                nosql_handler = DatosNoSQL(model)
                nosql_handler.delete(pk)
                return {'message': 'Nota de alumno eliminada correctamente'}
    
    except Exception as e:
        raise

# Vistas SQL
@csrf_exempt 
@require_http_methods(["GET"])
def obtener_datos(request):
    try:
        datos = handle_crud_operation(Datos, 'sql', request, operation='get_all')
        return JsonResponse(datos, safe=False)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt 
@require_http_methods(["GET"])
def obtener_producto(request, pk):
    try:
        dato = handle_crud_operation(Datos, 'sql', request, pk=pk, operation='get')
        return JsonResponse({
            'nombre': dato.nombre, 
            'descripcion': dato.descripcion, 
            'valor': str(dato.valor)
        })
    except Datos.DoesNotExist:
        return JsonResponse({'error': 'Alumno no encontrado'}, status=404)

@csrf_exempt  
@require_http_methods(["POST"])
def crear_producto(request):
    try:
        data = handle_crud_operation(Datos, 'sql', request, operation='create')
        return JsonResponse(data, status=201)
    except KeyError as e:
        return JsonResponse({'error': f'Falta el campo: {str(e)}'}, status=400)

@csrf_exempt
@require_http_methods(["PUT"])
def actualizar_producto(request, pk):
    try:
        data = handle_crud_operation(Datos, 'sql', request, pk=pk, operation='update')
        return JsonResponse(data)
    except Datos.DoesNotExist:
        return JsonResponse({'error': 'Alumno no encontrado'}, status=404)
    except KeyError:
        return JsonResponse({'error': 'Faltan datos'}, status=400)

@csrf_exempt
@require_http_methods(["DELETE"])
def eliminar_producto(request, pk):
    try:
        data = handle_crud_operation(Datos, 'sql', request, pk=pk, operation='delete')
        return JsonResponse(data)
    except Datos.DoesNotExist:
        return JsonResponse({'error': 'Alumno no encontrado'}, status=404)

def index(request):
    return render(request, 'templates/app/index.html')

# Vistas NoSQL con PyMongo
@csrf_exempt 
@require_http_methods(["GET"])
def obtener_datos_nosql(request):
    try:
        datos = handle_crud_operation(settings.MONGO_DATABASE['datos'], 'nosql', request, operation='get_all')
        return JsonResponse(datos, safe=False)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt 
@require_http_methods(["GET"])
def obtener_producto_nosql(request, pk):
    try:
        dato = handle_crud_operation(settings.MONGO_DATABASE['datos'], 'nosql', request, pk=pk, operation='get')
        if dato is None:
            return JsonResponse({'error': 'Alumno no encontrado'}, status=404)
        return JsonResponse(dato)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
 
@csrf_exempt  
@require_http_methods(["POST"])
def crear_producto_nosql(request):
    try:
        data = handle_crud_operation(settings.MONGO_DATABASE['datos'], 'nosql', request, operation='create')
        return JsonResponse(data, status=201)
    except KeyError as e:
        return JsonResponse({'error': f'Falta el campo: {str(e)}'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
@require_http_methods(["PUT"])
def actualizar_producto_nosql(request, pk):
    try:
        data = handle_crud_operation(settings.MONGO_DATABASE['datos'], 'nosql', request, pk=pk, operation='update')
        if data is None:
            return JsonResponse({'error': 'Alumno no encontrado'}, status=404)
        return JsonResponse(data)
    except KeyError:
        return JsonResponse({'error': 'Faltan datos'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    
@csrf_exempt
@require_http_methods(["DELETE"])
def eliminar_producto_nosql(request, pk):
    try:
        data = handle_crud_operation(settings.MONGO_DATABASE['datos'], 'nosql', request, pk=pk, operation='delete')
        return JsonResponse(data)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)