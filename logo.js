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

        img.onload = function(){
          const NW = this.naturalWidth;
          const NH = this.naturalHeight;
    
          // Динамические максимальные размеры
          const MAX_W = Math.min(600, window.innerWidth * 0.8); // 80% ширины экрана, но не более 600px
          const MAX_H = Math.min(300, window.innerHeight * 0.3); // 30% высоты экрана, но не более 300px

          // Рассчет пропорций
          const aspectRatio = NH / NW;

          if (NW < MAX_W && NH < MAX_H) {
              this.style.width = NW + 'px';
              this.style.height = NH + 'px';
          } 
          else {
              // Корректируем размеры с учетом пропорций
              let calculatedWidth = MAX_W;
              let calculatedHeight = calculatedWidth * aspectRatio;
      
              if (calculatedHeight > MAX_H) {
                  calculatedHeight = MAX_H;
                  calculatedWidth = calculatedHeight / aspectRatio;
              }
      
              this.style.maxWidth = calculatedWidth + 'px';
              this.style.maxHeight = calculatedHeight + 'px';
              this.style.width = '100%'; // Для лучшей адаптации внутри контейнера
              this.style.height = 'auto';
          }
      
          this.style.objectFit = 'contain';
          this.style.margin = '20px 0';

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
