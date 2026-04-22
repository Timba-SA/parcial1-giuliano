const fs = require('fs');
const glob = require('glob');

const fixFile = (file) => {
  let content = fs.readFileSync(file, 'utf8');
  
  content = content.replace(/import\s+\{([^}]+)\}\s+from\s+['"]([^'"]+)['"]/g, (match, imports, path) => {
    const parts = imports.split(',').map(s => s.trim());
    const newParts = parts.map(p => {
      const typeNames = ['Categoria', 'CategoriaCreate', 'Ingrediente', 'IngredienteCreate', 'IngredienteUpdate', 'Producto', 'ProductoCreate', 'Usuario', 'UsuarioCreate', 'PedidoOut'];
      if (typeNames.includes(p)) {
        return `type ${p}`;
      }
      return p;
    });
    return `import { ${newParts.join(', ')} } from '${path}'`;
  });
  
  fs.writeFileSync(file, content, 'utf8');
};

const files = glob.sync('src/**/*.{ts,tsx}');
files.forEach(fixFile);
