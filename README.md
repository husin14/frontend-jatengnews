cara deploy ke docker local:
docker build -t frontend-tvku:1 .
docker build -f Dockerfile2 -t frontend-tvku:1 .
docker run -d --env-file .env --name frontend-tvku-1 --restart unless-stopped -p 3123:8080 frontend-tvku:1




# npm run dev -- -H 192.168.2.139 -p 3000
# #1B91CE






git stash -u
git rebase -i HEAD~<jumlah>
git stash pop





di halaman http://192.168.2.139:3000/berita/show/20680, di bagian sidebar section Berita     
   Terbaru dan Berita Populer, saya     
      ingin teks di dalam <a href="/berita/show/20695">TEKS</a> yang letaknya di samping <i     
         
      class="icon-calendar3"></i> itu TEKS nya dibikin warna hitam pekat