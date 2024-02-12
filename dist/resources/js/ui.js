window.addEventListener("DOMContentLoaded", () => {
  commonInit();
  layoutFunc();
  formFunc();
});
window.addEventListener("load", () => {
  bottomLayer();
});


/**
 * device check
 */
function commonInit() {
  let touchstart = "ontouchstart" in window;
  let userAgent = navigator.userAgent.toLowerCase();
  if (touchstart) {
    browserAdd("touchmode");
  }
  if (userAgent.indexOf("samsung") > -1) {
    browserAdd("samsung");
  }

  if (
    navigator.platform.indexOf("Win") > -1 ||
    navigator.platform.indexOf("win") > -1
  ) {
    browserAdd("window");
  }

  if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i)) {
    // iPad or iPhone
    browserAdd("ios");
  }

  function browserAdd(opt) {
    document.querySelector("html").classList.add(opt);
  }
}

/*
  resize
*/
function resizeAction(callback) {
  let windowWid = 0;
  window.addEventListener("resize", () => {
    if (window.innerWidth !== windowWid) {
      if (callback) {
        callback();
      }
    }
    windowWid = window.innerWidth;
  });
}

/**
 * 레이아웃
 */
function layoutFunc() {
  function mbMenu() {
    var touchstart = "ontouchstart" in window;
    var btn_gnb_opener = document.querySelector(".btn_gnb_opener"),
      mobile_mainmenu_zone = document.querySelector(".mobile_mainmenu_zone"),
      mainmenu_dim = document.querySelector(".mainmenu_dim"),
      btn_mbmenuclose = document.querySelector(".btn_mbmenuclose"),
      mobile_mainmenu_wrap = document.querySelector(".mobile_mainmenu_wrap");
    domHtml = document.querySelector("html"),
      domBody = document.querySelector("body");

    // init 
    if (mobile_mainmenu_zone === null) {
      return;
    }
    btn_gnb_opener.addEventListener("click", function(e) {
      e.preventDefault();
      totalOpen();
    }, false);
    btn_mbmenuclose.addEventListener("click", function(e) {
      e.preventDefault();
      totalClose();
    }, false);
    mainmenu_dim.addEventListener("click", function(e) {
      e.preventDefault();
      totalClose();
    }, false);
    resizeAction(() => {
      if (window.innerWidth > 1023) {
        totalClose();
      }
    });

    function totalOpen() {
      mobile_mainmenu_zone.classList.add("active")
      setTimeout(function() {
        mobile_mainmenu_zone.classList.add("motion");
        setTimeout(function() {
          if (!!mobile_mainmenu_wrap) {
            setTabControl(".mobile_mainmenu_wrap");
          }
        }, 500);
        if (touchstart) {
          domHtml.classList.add("touchDis");
        }
      }, 30);
    }

    function totalClose() {
      mobile_mainmenu_zone.classList.remove("motion");
      setTimeout(function() {
        mobile_mainmenu_zone.classList.remove("active");
        domHtml.classList.remove("touchDis");
        btn_gnb_opener.focus();
      }, 500);
    }
  }
  mbMenu();
}

/* rock */
function rockMenu(item) {
  const itemMenu = document.querySelector(item);
  if (!!itemMenu) {
    itemMenu.classList.add("active");
  }
}

/* popup */
class DesignPopup {
  constructor(option) {
    // variable
    this.option = option;
    this.selector = document.querySelector(this.option.selector);
    this.popup_box_item = this.selector.querySelector(".popup_box_item");
    if (!this.selector) {
      return;
    }

    this.design_popup_wrap = document.querySelectorAll(".popup_wrap");
    this.domHtml = document.querySelector("html");
    this.domBody = document.querySelector("body");
    this.pagewrap = document.querySelector(".page_wrap");
    this.layer_wrap_parent = null;
    this.btn_closeTrigger = null;
    this.scrollValue = 0;

    // init
    const popupGroupCreate = document.createElement("div");
    popupGroupCreate.classList.add("layer_wrap_parent");
    if (!this.layer_wrap_parent && !document.querySelector(".layer_wrap_parent")) {
      this.pagewrap.append(popupGroupCreate);
    }
    this.layer_wrap_parent = document.querySelector(".layer_wrap_parent");


    // event
    this.btn_close = this.selector.querySelectorAll(".btn_popup_close");
    this.bg_design_popup = this.selector.querySelector(".bg_dim");
    let closeItemArray = [...this.btn_close];
    if (!!this.selector.querySelectorAll(".close_trigger")) {
      this.btn_closeTrigger = this.selector.querySelectorAll(".close_trigger");
      closeItemArray.push(...this.btn_closeTrigger);
    }
    if (closeItemArray.length) {
      closeItemArray.forEach((element) => {
        element.addEventListener("click", (e) => {
          e.preventDefault();
          this.popupHide(this.selector);
        }, false);
      });
    }
  }
  dimCheck() {
    const popupActive = document.querySelectorAll(".popup_wrap.active");
    if (!!popupActive[0]) {
      popupActive[0].classList.add("active_first");
    }
    if (popupActive.length > 1) {
      this.layer_wrap_parent.classList.add("has_active_multi");
    } else {
      this.layer_wrap_parent.classList.remove("has_active_multi");
    }
  }
  popupShow() {
    this.design_popup_wrap_active = document.querySelectorAll(".popup_wrap.active");
    if (this.selector == null) {
      return;
    }
    this.domHtml.classList.add("touchDis");
    this.selector.classList.add("active");
    if (!!this.popup_box_item) {
      this.popup_box_item.setAttribute("tabindex", "0");
    }

    setTimeout(() => {
      this.selector.classList.add("motion_end");
      setTabControl(this.selector);
    }, 30);
    if ("beforeCallback" in this.option) {
      this.option.beforeCallback();
    }
    if ("callback" in this.option) {
      this.option.callback();
    }
    if (!!this.design_popup_wrap_active) {
      this.design_popup_wrap_active.forEach((element, index) => {
        if (this.design_popup_wrap_active !== this.selector) {
          element.classList.remove("active");
        }
      });
    }
    this.layer_wrap_parent.append(this.selector);
    this.dimCheck();
  }
  popupHide() {
    let target = this.option.selector;
    if (!!target) {
      this.selector.classList.remove("motion");
      if ("beforeClose" in this.option) {
        this.option.beforeClose();
      }
      //remove
      this.selector.classList.remove("motion_end");
      console.log(this.popup_box_item);
      if (!!this.popup_box_item) {
        this.popup_box_item.removeAttribute("tabIndex");
      }
      setTimeout(() => {
        this.selector.classList.remove("active");
      }, 400);
      this.design_popup_wrap_active = document.querySelectorAll(".popup_wrap.active");
      this.dimCheck();
      if ("closeCallback" in this.option) {
        this.option.closeCallback();
      }
      if (this.design_popup_wrap_active.length == 1) {
        this.domHtml.classList.remove("touchDis");
      }
    }
  }
}


function bottomLayer() {
  const page_wrap = document.querySelector(".page_wrap");
  const bottom_layer_wrap = document.querySelector(".bottom_layer_wrap");
  action();
  window.addEventListener("resize", () => {
    action();
  });

  function action() {
    if (!!bottom_layer_wrap && !!page_wrap) {
      page_wrap.style.paddingBottom = bottom_layer_wrap.getBoundingClientRect().height + 'px';
    }
  }
}



/* 레이어 포커스 머물게 하는 함수 */
function setTabControl(element) {
  let focusable = [];
  let el_firstFocus = null;
  let el_lastFocus = null;
  let targetElement = typeof element == "object" ? element : document.querySelector(element);
  const targetElementAll = targetElement.querySelectorAll("*");
  targetElement.setAttribute("tabIndex", "0");
  if (!!targetElementAll) {
    targetElementAll.forEach((item) => {
      if (item.tagName.match(/^A$|AREA|INPUT|TEXTAREA|SELECT|BUTTON/gim) && parseInt(item.getAttribute("tabIndex")) !== -1) {
        focusable.push(item);
      }
      if ((item.getAttribute("tabIndex") !== null) && (parseInt(item.getAttribute("tabIndex")) >= 0) && (item.getAttribute("tabIndex", 2) !== 32768)) {
        focusable.push(item);
      }
    });
  }

  el_firstFocus = focusable[0];
  el_lastFocus = focusable[focusable.length - 1];
  el_firstFocus.addEventListener("keydown", (e) => {
    let keyCode = e.keyCode || e.which;
    if (keyCode == 9) {
      if (e.shiftKey) {
        el_lastFocus.focus();
        e.preventDefault();
      }
    }
  });
  el_lastFocus.addEventListener("keydown", (e) => {
    let keyCode = e.keyCode || e.which;
    if (keyCode == 9) {
      if (!e.shiftKey) {
        el_firstFocus.focus();
        e.preventDefault();
      }
    }
  });
  el_firstFocus.focus();
}


/* 메인 공지팝업 */
function noticePopup() {
  var notice_popup_wrap = document.querySelector(".notice_popup_wrap");
  var notice_popup_cols = document.querySelectorAll(".notice_popup_cols");
  var btn_popup_close_trigger = document.querySelectorAll(".notice_popup_wrap .close_trigger");
  var today_check_trigger = document.querySelector(".notice_popup_wrap .today_check");
  var notice_popup_cols_length = notice_popup_cols.length;


  // cookie 조회
  if (document.cookie.length) {
    var parseCookie = str =>
      str
      .split(';')
      .map(v => v.split('='))
      .reduce((acc, v) => {
        acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
        return acc;
      }, {});
    var getCookie = parseCookie(document.cookie);
  }

  if (!!today_check_trigger) {
    today_check_trigger.addEventListener("click", (e) => {
      setCookie('noticeCookie', "true", 1);
    });
  }


  /* notice_popup_cols_length = document.querySelectorAll(".notice_popup_cols").length;
  if(notice_popup_cols_length ===0){return;}
  today_check_trigger.forEach(function(element,index){
    if(document.cookie.length===0){return;}
    var parent_target = element.closest(".notice_popup_cols");
    if(getCookie.hasOwnProperty(element.getAttribute("id"))){
      closePopup(parent_target);
    }
  });

  if(document.querySelectorAll(".notice_popup_cols").length==1){
    notice_popup_wrap.classList.add("only_one");
  }else if(document.querySelectorAll(".notice_popup_cols").length>1){
    notice_popup_wrap.classList.remove("only_one");
  }else{
    return;
  }
  
  notice_popup_wrap.classList.add("active");

  btn_popup_close.forEach(function(element){
    element.addEventListener("click",function(e){
      e.preventDefault();
      var parent_target = e.currentTarget.closest(".notice_popup_cols");
      closePopup(parent_target);
    });
  });

  btn_popup_close_trigger.forEach(function(element){
    element.addEventListener("click",function(e){
      e.preventDefault();
      var parent_target = e.currentTarget.closest(".notice_popup_cols");
      closePopup(parent_target);
    });
  });

  today_check_trigger.forEach(function(element){
    element.addEventListener("click",function(e){
      var currentTarget = e.currentTarget;
      var parent_target = currentTarget.closest(".notice_popup_cols");
      if(currentTarget.checked){
        setTimeout(function(){
          closePopup(parent_target);
          setCookie(currentTarget.getAttribute("id"),"true",1);
        },200);
      }
    });
  });
 */
  function closePopup(target) {
    var target_element = target;
    notice_popup_cols = document.querySelectorAll(".notice_popup_cols");
    notice_popup_cols_length = notice_popup_cols.length;
    if (notice_popup_cols_length == 1) {
      notice_popup_wrap.classList.remove("active");
    }
    target_element.remove();
  }
  var setCookie = function(name, value, exp) {
    var date = new Date();
    date.setTime(date.getTime() + exp * 24 * 60 * 60 * 1000);
    document.cookie = name + '=' + value + ';expires=' + date.toUTCString() + ';path=/';
  };
}


function formFunc() {
  addDynamicEventListener(document.body, 'change', '.combo_select', function(e) {
    let thisTarget = e.target;
    if (thisTarget.value === "") {
      thisTarget.classList.add("placeholder");
    } else {
      thisTarget.classList.remove("placeholder");
    }
  });
}