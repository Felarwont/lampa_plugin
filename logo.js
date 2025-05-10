(function(){
  'use strict';

  const MIN_W = 375;  // порог в пикселях

  function startPlugin(){
    window.logoplugin = true;

    Lampa.Listener.follow('full', function(e){
      if (e.type !== 'complite' || Lampa.Storage.get('logo_glav') === '1') return;

      const data = e.data.movie;
      const type = data.name ? 'tv' : 'movie';

      if (!data.id) return;

      const url = Lampa.TMDB.api(
        `${type}/${data.id}/images?api_key=${Lampa.TMDB.key()}&language=${Lampa.Storage.get('language')}`
      );

      $.get(url, function(res){
        if (!res.logos || !res.logos[0]) return;

        const logoPath = res.logos[0].file_path;
        if (!logoPath) return;

        // создаём img-элемент вручную, чтобы повесить onload
        const img = new Image();
        img.src = Lampa.TMDB.image('/t/p/w300' + logoPath.replace('.svg','.png'));

        img.onload = function(){
          // если родная ширина < MIN_W — увеличиваем
          if (this.naturalWidth < MIN_W) {
            this.style.width           = MIN_W + 'px';
            this.style.height          = 'auto';
            this.style.objectFit       = 'contain';  
          }
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
      values: {1:'Скрыть', 0:'Отображать'},
      default: '0'
    },
    field: {
      name: 'Логотипы вместо названий',
      description: 'Отображает логотипы фильмов вместо текста'
    }
  });

  if (!window.logoplugin) startPlugin();
})();
