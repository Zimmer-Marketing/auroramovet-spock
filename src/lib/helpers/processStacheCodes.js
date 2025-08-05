export function processStacheCodes(/** @type {any} */ route) {
    let stacheCodes = route.match(/[^{}]+(?=\})/g);
    stacheCodes?.forEach((/** @type {string} */ code) => {
      let codeArray = code.split(":");
      let codeType = codeArray[0];
      let codeValue = codeArray[1];
      let codeLink = codeArray[2];
      let codeString = `{${code}}`;
  
      let codeHTML = "";
  
      switch (codeType) {
        case "video":
          codeHTML = `<div class="p-5"><div style="position:relative;padding-bottom:56.25%"><iframe src="https://muse.ai/embed/${codeValue}?links=0&logo=0&title=0" style="width:100%;height:100%;position:absolute;left:0;top:0" frameborder="0" allowfullscreen></iframe></div></div>`;
          break;
        case "image":
          codeHTML = `<img src="${codeValue}" class="w-full" />`;
          break;
        case "button":
          codeHTML = `<button class="btn btn-outline rounded-full shopgenie-book-appt-btn text-white whitespace-nowrap bg-primary" style="font-family: 'Roboto Condensed', sans-serif;"> ${codeValue} <img class="md:h-6 md:w-6 h-4 w-4" src="/yellow-arrow.svg" alt="yellow arrow svg"> </button>`;
          break;
        case "link":
          codeHTML = `<a href="${codeValue}" class="text-brand-primary">${codeValue}</a>`;
          break;
        case "photo-grid":
          if (route.meta.photo_grids && route.meta.photo_grids.length > 0) {
            if (codeValue === route.meta.photo_grids[0].grid_id) {
              const gridData = route.meta.photo_grids[0];
              const columnsClass = "lg:grid-cols-" + gridData.columns;
              const images = gridData.images;
              const photoGridClass = `grid grid-cols-1 ${columnsClass} gap-4 py-6`;
              let imagesHTML = "";
              images.forEach((image, index) => {
                imagesHTML += `<a href="${image.large}" target="_blank" class="hover:animate-pulse"><img src="${image.medium}" alt="${image.title}" class="w-full" /><p class="font-semibold">${image.title}</p></a>`;
              });
              codeHTML = `
                <div class="${photoGridClass}">
                  ${imagesHTML}
                </div>
                `;
            }
          }
          break;
        default:
          codeHTML = codeString;
          break;
      }
  
      route = route.replace(codeString, codeHTML);
    });
    return route;
  }