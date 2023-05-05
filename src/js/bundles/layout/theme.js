import "Styles/layout/theme.scss";
import 'keen-slider/keen-slider.min.css'
import KeenSlider from 'keen-slider'


let CUSTOMJS = {
    version: "1.0.0"
}
////////////////////Collection page
CUSTOMJS.Collection = {
    ////Selecting collection components
    selectors:{
        template:'#main-collection',
        filters:'[data-action="filter"]',
        loadMoreBtn:'[data-action="loadMore"]',
        collectionSectionId:'main-collection',
        productGridWrap:'[data-role="product-grid-wrap"]',
        priceApplyBtn:'[data-role=apply-price]',
        minPriceInput:'[data-role="min-price"]',
        maxPriceInput:'[data-role="max-price"]',
        filterDisplayButton:"[data-role='filter-display']",
        filterWrapper:'[data-role="filter-wrapper"]',
    },
    ////Initialize collection js
    init : function(){
        this.collectionTemplate = document.querySelector(`${this.selectors.template}`);
        this.filters = document.querySelectorAll(`${this.selectors.filters}`);
        this.loadMoreBtn = document.querySelector(`${this.selectors.loadMoreBtn}`);
        this.priceApplyBtn = document.querySelector(`${this.selectors.priceApplyBtn}`);
        this.minPriceInput = document.querySelector(`${this.selectors.minPriceInput}`);
        this.maxPriceInput = document.querySelector(`${this.selectors.maxPriceInput}`);
        this.filterDisplayButton = document.querySelectorAll(`${this.selectors.filterDisplayButton}`);
        this.filterWrapper = document.querySelector(`${this.selectors.filterWrapper}`);
        if(!this.collectionTemplate) return;
        //////////////attaching listeners
        this.filters.forEach(element => {
            element.addEventListener("change",this.initiateFilter.bind(this,element));
        });

        this.loadMoreBtn.addEventListener("click",this.loadMoreProducts.bind(this,this.loadMoreBtn));

        this.priceApplyBtn.addEventListener("click",this.priceFilterUpdate.bind(this));

        this.filterDisplayButton.forEach(element =>{
            element.addEventListener("click",this.filterDisplayToggle.bind(this));
        })
    },
    //// Initiate filters
    initiateFilter : function(element){
        let currentCollection = window.location.pathname;
        let selectedValue = Array.from(this.filters).filter(el => el.checked || el.getAttribute("type") == "hidden").map(el => `${el?.getAttribute("name")}=${el?.value}`);
        let newUrl = `${currentCollection}?${selectedValue.join('&')}`;
        window.history.pushState({},'',newUrl);
        CUSTOMJS.Collection.updateCollection(selectedValue);
    },
    //// Filter display toggle
    filterDisplayToggle:function(){
        this.filterWrapper.classList.toggle("active");
        this.filterWrapper.classList.contains("active") ? document.body.style.overflow = "hidden" : document.body.style.overflow = "auto";
    },
    //// Update collection html on filtering
    updateCollection : async function(selectedValue){
        let parser = new DOMParser();
        let sectionUrl = window.location.pathname + "?sections=" + this.selectors.collectionSectionId + `${selectedValue.join("&").trim().length > 1 ? '&' + selectedValue.join("&"): ""}`;
        this.displayLoader();
        let data = await fetch(sectionUrl).then(res => res.json()).then(data => data);
        let collectionHtml = parser.parseFromString(data["main-collection"],"text/html").querySelector(`${this.selectors.productGridWrap}`);
        let loadMoreBtn = parser.parseFromString(data["main-collection"],"text/html").querySelector(`${this.selectors.loadMoreBtn}`);
        this.loadMoreBtn.setAttribute("href",loadMoreBtn.getAttribute("href"));
        this.loadMoreBtn.textContent = loadMoreBtn.textContent;
        document.querySelector(`${this.selectors.productGridWrap}`).innerHTML = collectionHtml.innerHTML;
        this.displayLoader();
    },
    //// Price filter update 
    priceFilterUpdate : function(){
        let hiddenMinPriceInput = document.querySelector(`[data-id="${CUSTOMJS.Collection.minPriceInput.dataset.role}"]`);
        let hiddenMaxPriceInput = document.querySelector(`[data-id="${CUSTOMJS.Collection.maxPriceInput.dataset.role}"]`);
        let event = new Event("change");
        hiddenMinPriceInput.value = CUSTOMJS.Collection.minPriceInput.value;
        hiddenMaxPriceInput.value = CUSTOMJS.Collection.maxPriceInput.value;
        hiddenMaxPriceInput.dispatchEvent(event);
        hiddenMinPriceInput.dispatchEvent(event);
    },
    //// Load more functionality
    loadMoreProducts :async function(element,e){
        e.preventDefault();
        let parser = new DOMParser();
        let nextPageUrl = element.getAttribute("href");
        if(nextPageUrl.trim().length < 1 ) return;
        let sectionUrl = nextPageUrl + `&sections=${this.selectors.collectionSectionId}`;
        this.displayLoader();
        let data = await fetch(sectionUrl).then(res => res.json()).then(data => data);
        let collectionHtml = parser.parseFromString(data["main-collection"],"text/html").querySelector(`${this.selectors.productGridWrap}`);
        let loadMoreBtn = parser.parseFromString(data["main-collection"],"text/html").querySelector(`${this.selectors.loadMoreBtn}`)
        element.setAttribute("href",loadMoreBtn.getAttribute("href"));
        element.textContent = loadMoreBtn.textContent;
        document.querySelector(`${this.selectors.productGridWrap}`).insertAdjacentHTML("beforeend",collectionHtml.innerHTML);
        this.displayLoader();
    },
    //// Display loader toggle
    displayLoader : function(){
        CUSTOMJS.Collection.collectionTemplate.classList.toggle("loading");
    }
}
///////////////////Product page js
CUSTOMJS.Product = {
    //// Selecting product components
    selectors:{
        productTemplate:"#main-product-grid",
        productSlider:"[data-role='slider-gallery']",
        thumbSlider:"[data-role='slider-thumbnail']",
        productSku:"[data-role='sku']",
        productPrice:"[data-role='price']",
        optionSelectors:"[data-role='option']",
        addToCartButton:"[data-role='addToCart']",
        productForm:"[data-role='product-form']",
        productData:"[data-role='product-data']",
        btnIncrement:"[data-role='increment']",
        quantityInput:"[data-role='quantity']",
        btnDecrement:"[data-role='decrement']",
    },
    //// Initialize product js
    init:function(){
        this.productTemplate = document.querySelector(`${this.selectors.productTemplate}`);
        this.productSlider = document.querySelector(`${this.selectors.productSlider}`);
        this.thumbSlider = document.querySelector(`${this.selectors.thumbSlider}`); 
        this.productPrice = this.productTemplate?.querySelector(`${this.selectors.productPrice}`);
        this.productSku = this.productTemplate?.querySelector(`${this.selectors.productSku}`);
        this.optionSelectors = this.productTemplate?.querySelectorAll(`${this.selectors.optionSelectors}`);
        this.addToCartButton = this.productTemplate?.querySelector(`${this.selectors.addToCartButton}`);
        this.productForm = this.productTemplate?.querySelector(`${this.selectors.productForm}`);
        this.productData = this.productTemplate ? JSON.parse(this.productTemplate?.querySelector(`${this.selectors.productData}`).textContent) : "";
        this.btnDecrement = this.productTemplate?.querySelector(`${this.selectors.btnDecrement}`);
        this.btnIncrement = this.productTemplate?.querySelector(`${this.selectors.btnIncrement}`);
        this.quantityInput = this.productTemplate?.querySelector(`${this.selectors.quantityInput}`);

        if(!this.productTemplate) return;

        this.initiateSlider();
        Array.from(this.optionSelectors).forEach(function(el,ind){ el.addEventListener("change",this.updateVariant.bind(this))},this);
        this.updateQuantity();
    },
    //// Initiate product slider
    initiateSlider : function(){
        if(this.productSlider){
          this.productSlide = new KeenSlider(CUSTOMJS.Product.productSlider, {
                drag:true,
                loop:true,
                mode:"snap",
                created:(slider)=>{
                    /////////////////Move to the deafult loaded variant image
                    let activeSlideIndex = slider.slides.indexOf(slider.slides.find(el => el.classList.contains("is_active")));
                    slider.moveToIdx(activeSlideIndex);
                }
            },[])
        }
        if(this.thumbSlider){
          this.thumbSlide =  new KeenSlider(CUSTOMJS.Product.thumbSlider, {
                drag:true,
                mode:"snap",
                loop:true,
                slides:{
                    perView:4,
                    spacing:10,
                },
                created:(slider)=>{
                    /////////////////Move to the deafult loaded variant image
                    let activeSlideIndex = slider.slides.indexOf(slider.slides.find(el => el.classList.contains("is_active")));
                    slider.moveToIdx(activeSlideIndex);
                }
            },[])
        }
        this.productSlide.on("slideChanged",function(slider){
            let activeIndex = slider.track.details.rel;
            CUSTOMJS.Product.thumbSlide.moveToIdx(activeIndex) ;
            
        })
        this.thumbSlide.on("slideChanged",function(slider){
            if(CUSTOMJS.Product.productSlide.variantChange) return;
            let activeIndex = slider.track.details.rel;
            CUSTOMJS.Product.productSlide.moveToIdx(activeIndex);
        })
        CUSTOMJS.Product.thumbSlide.slides.forEach((el,ind)=>{
            el.addEventListener("click",function(e){
                CUSTOMJS.Product.productSlide.variantChange = true;
                CUSTOMJS.Product.thumbSlide.moveToIdx(ind);
                CUSTOMJS.Product.productSlide.moveToIdx(ind);
            })
        })
    },
    //// On variants update, upadting data
    updateVariant : function(){
        let selectedOptions = Array.from(this.optionSelectors).filter(option => option.checked).map(option => option.value);
        this.selectedOptionData = this.productData.filter(data => data.options.length == selectedOptions.length && data.options.every(option => selectedOptions.indexOf(option) != -1))[0];
        let url = window.location.pathname + `?variant=${this.selectedOptionData.id}`;
        let variantInput = this.productForm.querySelector("input[name='id']");
        variantInput.value = this.selectedOptionData.id;
        window.history.pushState({},'',url);
        this.updateProductUi();
    },
    //// quantity button 
    updateQuantity: function(){
        ////////////////binding quantities
        this.quantityInput.addEventListener("change",function(){
            CUSTOMJS.Product.productForm.querySelector("input[name='quantity']").value = CUSTOMJS.Product.quantityInput.value;
        });
        CUSTOMJS.Product.btnIncrement.addEventListener("click",function(e){
            e.preventDefault();
            let currentVal = Number(CUSTOMJS.Product.quantityInput.value);
            let newVal = ++currentVal;
            CUSTOMJS.Product.quantityInput.value = newVal;
        })
        CUSTOMJS.Product.btnDecrement.addEventListener("click",function(e){
            e.preventDefault();
            let currentVal = Number(CUSTOMJS.Product.quantityInput.value);
            if(currentVal == 1) return;
            let newVal = --currentVal;
            CUSTOMJS.Product.quantityInput.value = newVal;
        })
    },
    //// ON variant update, updating product ui elements
    updateProductUi :async function(){
        let sectionUrl = window.location.href + `${window.location.href.includes("?") ? "&" : "?"}sections=${this.productTemplate.dataset.id}`;
        let data = await fetch(sectionUrl).then(res => res.json());
        let parser = new DOMParser();
        let html = parser.parseFromString(data["main-product-grid"],"text/html");
        this.productPrice ? this.productPrice.innerHTML = html.querySelector(`${this.selectors.productPrice}`).innerHTML : "";
        this.productSku ? this.productSku.innerHTML = html.querySelector(`${this.selectors.productSku}`).innerHTML : "";
        this.selectedOptionData.available ? this.addToCartButton.classList.remove("soldOut") : this.addToCartButton.classList.add("soldOut"); 
        let productSlider = html.querySelector(`${this.selectors.productSlider}`);
        let thumbSlider = html.querySelector(`${this.selectors.thumbSlider}`);
        this.productSlider.innerHTML = productSlider.innerHTML;
        this.thumbSlider.innerHTML = thumbSlider.innerHTML;
        this.initiateSlider();
    }
}
CUSTOMJS.Collection.init();
CUSTOMJS.Product.init();