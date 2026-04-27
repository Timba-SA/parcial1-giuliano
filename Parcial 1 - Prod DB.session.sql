SELECT 
    p.id AS producto_id,
    p.nombre AS producto,
    p.precio_base,
    c.nombre AS categoria,
    pc.es_principal,
    p.deleted_at
FROM 
    productos p
JOIN 
    producto_categorias pc ON p.id = pc.producto_id
JOIN 
    categorias c ON pc.categoria_id = c.id
WHERE 
    p.deleted_at IS NULL;