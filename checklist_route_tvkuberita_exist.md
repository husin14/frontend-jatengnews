# CodeIgniter Routes Documentation

## Application Information
- **Application Name**: TVKU - Televisi Kampus UDINUS
- **Framework**: CodeIgniter
- **Default Controller**: beranda
- **404 Override**: Not set (empty)

## Default Route
```
/ -> beranda::index()
```

## Controllers and Available Routes

### 1. Beranda Controller (`beranda.php`)
**Default Controller** - Main homepage and news management

Routes:
- `/` → `beranda::index()` - Homepage with latest news  ✅
- `/index2` → `beranda::index2()` - Alternative homepage layout
- `/news_show/{id}` → `beranda::news_show()` - Show individual news article ✅
- `/news_kategori/{slug}/{page?}` → `beranda::news_kategori()` - News by category with pagination ✅
- `/acara/{page?}` → `beranda::acara()` - TV schedule/program listings 
- `/acara_detail/{page?}` → `beranda::acara_detail()` - Detailed program information
- `/vote` → `beranda::vote()` - Voting page
- `/detail_iklan/{id}` → `beranda::detail_iklan()` - Advertisement detail page ❌ belum ada
- `/coba` → `beranda::coba()` - Testing page for JS preroll functionality

### 2. Live Controller (`live.php`) 
**Streaming management** - Live streaming functionality

Routes:
- `/live` → `live::index()` - Live streaming page
- `/live/edit_link_streaming` → `live::edit_link_streaming()` - Edit streaming link (admin functionality)

### 3. Pages Controller (`pages.php`)
**Static pages and program management**

Routes:
- `/pages/news_show/{id}` → `pages::news_show()` - Show individual news article (alternative view)
- `/pages/program/{page?}` → `pages::program()` - TV programs with pagination
- `/pages/beritaprogram/{page?}` → `pages::beritaprogram()` - News about programs

### 4. Career Controller (`career.php`)
**Career page**

Routes:
- `/career` → `career::index()` - Career/jobs page

### 5. Webservice Controller (`webservice.php`)
**API endpoints for mobile app or external services**

Routes:
- `/webservice` → `webservice::index()` - Base API endpoint
- `/webservice/get_index` → `webservice::get_index()` - Get all news articles
- `/webservice/get_detail/{id}` → `webservice::get_detail()` - Get specific news article details
- `/webservice/get_index_kategori/{category}` → `webservice::get_index_kategori()` - Get news by category
- `/webservice/get_kategori` → `webservice::get_kategori()` - Get all categories

## Key Features
- News management with categories and pagination
- TV program scheduling
- Live streaming functionality
- Advertisement management
- Mobile API endpoints
- Video content management

## Notes
- The application appears to be a television news website with live streaming capabilities
- Multiple controllers handle different aspects of the platform (news, programs, streaming)
- API endpoints are available for mobile applications
- Pagination is implemented for news and program listingsv