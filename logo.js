(function(){
  'use strict';

  function startPlugin(){
    window.logoplugin = true;

    Lampa.Listener.follow('full', function(e){
      if(e.type !== 'complite' || Lampa.Storage.get('logo_glav') === '1') return;

      const data = e.data.movie;
      const type = data.name ? 'tv' : 'movie';
      if(!data.id) return;

      const url = Lampa.TMDB.api(
        `${type}/${data.id}/images?api_key=${Lampa.TMDB.key()}&language=${Lampa.Storage.get('language')}`
      );

      $.get(url, function(res){
        if(!res.logos || !res.logos[0]) return;
        const logoPath = res.logos[0].file_path;
        if(!logoPath) return;

        // создаём img, чтобы повесить onload
        const img = new Image();

        // выбираем источник: SVG → оригинал, иначе тоже оригинал
        if(logoPath.endsWith('.svg')){
          img.src = Lampa.TMDB.image('/t/p/original'+logoPath);
        } else {
          img.src = Lampa.TMDB.image('/t/p/original'+logoPath);
        }

        img.onload = function() {
          const NW = this.naturalWidth;
          const NH = this.naturalHeight;
          
          // Динамические параметры
          const isMobile = window.matchMedia('(max-width: 768px)').matches;
          const container = e.object.activity.render().find('.full-start-new__title');
          const containerWidth = container.width();
          
          // Рассчет размеров
          let targetWidth = Math.min(
              NW, 
              isMobile ? containerWidth * 0.9 : 600, // На мобильных - 90% ширины контейнера
              window.innerWidth * 0.8 // Максимум 80% ширины экрана
          );
          
          let targetHeight = NH * (targetWidth / NW);
      
          // Применение стилей
          this.style.cssText = `
              width: ${targetWidth}px;
              height: ${targetHeight}px;
              max-width: 100%;
              max-height: ${isMobile ? '40vh' : '300px'};
              object-fit: contain;
              margin: ${isMobile ? '10px 0' : '20px 0'};
              display: block;
              margin-left: auto;
              margin-right: auto;
          `;
      
          // Важно: принудительный рефлоу перед обновлением
          container[0].offsetHeight;
          
          container
              .html('')
              .append(this);
      
          // Обработчик изменения размера
          let resizeTimer;
          window.addEventListener('resize', () => {
              clearTimeout(resizeTimer);
              resizeTimer = setTimeout(() => this.onload(), 200);
          });

          e.object.activity.render()
            .find('.full-start-new__title')
            .html('')         // очищаем текст
            .append(this);    // вставляем наше <img>
        };

      });
    });
  }

  if(!window.logoplugin) startPlugin();
})();
