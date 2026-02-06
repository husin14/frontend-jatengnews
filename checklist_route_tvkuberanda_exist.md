# Routes Documentation

This document lists all the routes available in the CodeIgniter application.

## Default Route

- **Default Controller**: `Home` (when accessing the root URL `/`)

## Available Controllers and Routes

### Home Controller (`/home`) ✅
- **GET /** - Default route, loads the home page (index method)
- **GET /home** - Loads the home page (index method)
- **GET /home/index_v1** - Loads version 1 of the home page
- **GET /home/index2** - Loads version 2 of the home page
- **GET /home/index3** - Loads version 3 of the home page
- **GET /home/cobag** - Displays PATH_DIR constant
- **GET /home/index_tracing** - Loads home tracing page
- **GET /home/cobajadwal** - Displays schedule information
- **GET /home/DateToDay** - Returns current day in Indonesian
- **GET /home/GetDateID** - Returns current day ID (0-6)
- **GET /home/ONAIR** - Checks current broadcast schedule

### Welcome Controller (`/welcome`)
- **GET /welcome** - Loads welcome message view
- **GET /welcome/index** - Same as /welcome

### Contact Controller (`/contact`) ✅
- **GET /contact** - Loads contact page

### Digital Marketing Controller (`/digitalmarketing`) ❌ skip dulu karena masih web terpisah
- **GET /digitalmarketing** - Redirects to `/dma`

### Live Controller (`/live`) ✅
- **GET /live** - Loads live streaming page

### News Controller (`/news`) ✅
- **GET /news** - Redirects to `../berita`

### Program Controller (`/program`) ✅
- **GET /program** - Loads program listing page with pagination
- **GET /program/index** - Same as /program
- **GET /program/index/{page}** - Paginated program listings (page number in segment 3)

### Sales Controller (`/sales`) ❌ skip dulu karena masih web terpisah
- **GET /sales** - Redirects to `/marketing`

### Seputar Udinus Controller (`/seputarudinus`) ❔ soalnya kok seperti kurang lengkap
- **GET /seputarudinus** - Loads seputar udinus page
- **GET /seputarudinus/dev** - Loads development version of seputar udinus
- **GET /seputarudinus/dev2** - Loads second development version
- **GET /seputarudinus/devzoom** - Loads zoom version of seputar udinus
- **GET /seputarudinus/content/{id}** - Loads specific content by ID
- **GET /seputarudinus/title/{id}** - Loads content by title ID with pagination
- **GET /seputarudinus/title/{id}/{page}** - Paginated content by title ID
- **GET /seputarudinus/cobaswiper** - Loads swiper demo page

## Reserved Routes Configuration

- **Default Controller**: `Home`
- **404 Override**: Not set (empty)
- **Translate URI Dashes**: `FALSE`

## Notes

- The application uses standard CodeIgniter routing conventions
- Some controllers redirect to other URLs or external paths
- Pagination is implemented for program and seputarudinus content
- The `translate_uri_dashes` option is disabled, so dashes in URLs will not be converted to underscores