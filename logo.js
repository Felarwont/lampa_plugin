(function(){
  'use strict';

  const MIN_W = 300;    // порог, если нужен
  const MARGIN_TOP = 50; // отступ сверху в пикселях

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
          // при желании можно проверить naturalWidth и только тогда что‑то делать
          // if(this.naturalWidth < MIN_W){ … }

          // ставим отступ сверху и сохраняем пропорции
          this.style.marginTop    = MARGIN_TOP + 'px';
          this.style.maxHeight    = 'none';
          this.style.width        = '100%';      // или конкретно MIN_W+'px'
          this.style.objectFit    = 'contain';

          // вставляем в заголовок
          e.object.activity.render()
            .find('.full-start-new__title')
            .html('')
            .append(this);
        };
      });
    });
  }

  Lampa.SettingsApi.addParam({
    component: 'interface',
    param: {
      name: 'logo_glav',
      type: 'select',
      values: {1:'Скрыть',0:'Отображать'},
      default: '0'
    },
    field: {
      name: 'Логотипы вместо названий',
      description: 'Показывать логотипы фильмов вместо текста'
    }
  });

  if(!window.logoplugin) startPlugin();
})();
