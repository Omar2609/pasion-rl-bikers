PASION RL BIKERS - INSTRUCCIONES

1. Descomprime el ZIP en una carpeta de tu PC.
2. Abre la carpeta PASION-RL-BIKERS con Visual Studio Code.
3. Haz doble clic en INICIAR.bat.
4. La primera vez necesita internet para instalar los componentes. Se eliminó bcryptjs para evitar el error 403 que apareció en la instalación.
5. Se abrira el sitio en http://localhost:3000

PANEL DE ADMINISTRACION
Entra a: http://localhost:3000/admin/login
Usuario inicial: admin
Clave inicial: CambiaEstaClave123!

IMPORTANTE:
- Cambia ADMIN_PASSWORD y SESSION_SECRET en el archivo .env antes de publicar el sitio en internet.
- El archivo data/members.json se crea automaticamente y guarda los miembros.
- El logo incluido es un marcador. Reemplaza public/images/logo-placeholder.svg por tu logo
  y actualiza la ruta de la imagen en views/partials/header.ejs si deseas usar otro nombre.
- Esta versión está preparada para ejecutarse localmente. Para publicarla en internet se
  deben configurar HTTPS, almacenamiento seguro de sesiones y otras medidas de producción.
