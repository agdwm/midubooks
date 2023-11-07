const isNavigationSupported = () => {
  return Boolean(document.startViewTransition)
}

const isAnExternalPage = () => {
  return Boolean(location.origin !== toUrl.origin)
}

const fetchPage = async(url) => {
  //vamos a cargar la página de destino para obtener el html
  const response = await fetch(url)
  const text = await response.text()
  //quedarnos solo con el contenido del html dentro de la etiqueta body
  const [, data] = text.match(/<body[^>]*>([\s\S]*)<\/body>/i)
  return data
}

export const startViewTransition = () => {
  if (!isNavigationSupported()) return

  window.navigation.addEventListener('navigate', (event) => {
    const toUrl = new URL(event.destination.url)

    // es una página externa?
    if (isAnExternalPage) return

    // si es una navegacion en el mismo dominio (origen) interceptamos el evento de la navegación
    event.intercept({
      async handler(){

        const data = await fetchPage(toUrl.pathname)
        // utilizar la API de View Transition API para animar la transición
        document.startViewTransition(() => {
          // como tiene que actualizar la vista
          document.body.innerHTML = data
          // el scroll hacia arriba del todo
        })
        document.documentElement.scrollTop = 0
      }
    })
  })
  }
