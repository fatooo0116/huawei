$(function (){
    var twzipcodeOptions = _viewData.user ? {
      'countySel': _viewData.user.county,
      'districtSel': _viewData.user.area
    } : null;
    $('#twzipcode').twzipcode(twzipcodeOptions);

    // Product categories and list
    var PRODUCT_OTHERS = '自填';
    var productCategories = {
        'tablet': {
          name: '平板電腦',
          list: [
            'MatePad 2022','MatePad T 10s','MatePad 11','MatePad','MatePad T 10','MediaPad M5 Lite',
          ]
        },
        'laptop': {
          name: '筆記型電腦',
          list: [
            'MateBook X Pro 2022','MateBook X Pro 2020','MateBook D 16','MateBook D 14 2022','MateBook D 14 2021','MateBook D 15 2021','MateBook D 15','MateBook D 14','MateBook 14 2020 AMD','MateBook 14 2021','MateBook 14s',
          ]
        },
        'wearable': {
          name: '穿戴裝置',
          list: [
            'WATCH GT 3 Pro','WATCH GT 3','WATCH GT Runner','WATCH GT 2 Pro','WATCH FIT 2','WATCH FIT mini','WATCH FIT','WATCH GT 2','WATCH GT 2e','WATCH GT','Band 7','Band 6','Band 3 Pro','Band 4e','Band 4','Band 4 Pro','Gentle Monster Eyewear ll',
          ]
        },
        'audio': {
          name: '音頻產品',
          list: [
            'FreeBuds Pro 2','FreeBuds Lipstick','FreeBuds SE','FreeBuds 4','FreeBuds 4i','FreeBuds Studio','FreeBuds Pro','FreeBuds 3','FreeBuds 3i','Sound X','Sound',
          ]
        },
        'smartphone': {
          name: '智慧型手機',
          list: [
            'P30 Pro','P30','Mate20 X (5G)','Mate20 X','Mate20 Pro','Mate20','nova 5T','nova 4e','nova 3i','Y9 Prime 2019','Y7 Pro 2019','Y6 Pro 2019','P20','P20 Pro',
          ]
        },
        'mateview': {
          name: 'MateView',
          list: [
              'MateView', 'MateView GT',
          ]
        },
        'wifi': {
          name: 'WiFi系列',
          list: [
            'AX3','WS5200','4G Router 3 Pro','B628','B818','WS5200','WS7200',
          ]
        },
        'none': {
          name: '無',
          list: [
              '無',
          ]
        },
    }

    var selectedProducts = {
      'owner': [],
      'wishlist': [],
    };
    
    // Populate stored products
    if(_viewData.products) {
      for(var rel in _viewData.products) {
        for(var product of _viewData.products[rel]) {
          addProduct(rel, product, true);
        }
      }
    }


  function fancyAlert2(content) {
      $.fancybox.open('<div class="fancyalert-content">2222' + content + "</div>");
  }



    function fancyAlert(content) {
        $.fancybox.open('<div class="fancyalert-content">' + content + "</div>");
    }

    function generateProductKey(rel, product) {
      return selectedProducts[rel].length + '_' + product.category + '_' + new Date().getTime();
    }

    function findProductByKey(rel, key) {
      return selectedProducts[rel].find(function(p) { return p.key == key });
    }

    function findProductBySnImei(rel, snimei) {
      return selectedProducts[rel].find(function(p) { return p.snimei == snimei });
    }

    function findProductByName(rel, name) {
      return selectedProducts[rel].find(function(p) { return p.name == name });
    }

    function findProductByCategoryAndName(rel, category, name) {
      return selectedProducts[rel].find(function(p) { return p.category == category && p.name == name; });
    }

    function validateSnImei(snimei) {
      return app.validator.validateSN(snimei) === true || app.validator.validateIMEI(snimei) === true;
    }

    function findDuplicateNames(rel) {
      var duplicateNames = selectedProducts[rel]
        .map(function(p) { return p.name; })
        .filter(function(name, index, names) { return names.indexOf(name) !== index });
      var duplicates = selectedProducts[rel].filter(function(p) { return duplicateNames.includes(p.name); });
      return duplicates;
    }

    function findDuplicateSnImei(rel) {
      var duplicateSnImei = selectedProducts[rel]
        .map(function(p) { return p.snimei; })
        .filter(function(snimei, index, snimeis) { return snimeis.indexOf(snimei) !== index });
      var duplicates = selectedProducts[rel].filter(function(p) { return duplicateSnImei.includes(p.snimei); });
      return duplicates;
    }

    $().fancybox({
      selector: 'a.thumb',
    });

    /**
     * Add a product
     * @param rel {String} owner|wishlist
     * @param product {String|Object}
     * @param isExisting {Boolean}
     */
    function addProduct(rel, product, isExisting = false) {
      if(typeof(product) == 'string') {
        product = {
          category: $('#product-category-' + rel).val(),
          name: product,
          snimei: '',
          usage: '',
          image: null,
        };
      }
      if(!product.key) {
        product.key = generateProductKey(rel, product);
      }

      // 檢查重複（同產品類別）
      // 僅在新增夢想清單，或者新增自填名稱產品時檢查
      if(rel == 'wishlist' || product.name == PRODUCT_OTHERS) {
        if(findProductByCategoryAndName(rel, product.category, product.name)) {
            fancyAlert('此產品已經在清單中了。');
            return;
        }
      }

      selectedProducts[rel].push(product);
      var categoryName = productCategories[product.category].name;

      // Table row
      var $table = $('#product-table-' + rel);
      var $row = $('<tr data-key="' + product.key + '" data-product="' + product.name + '"></tr>');
      var defaultProps = ' data-rel="' + rel + '" data-key="' + product.key + '" data-product="' + product.name + '" ';
      // 類別名稱
      $row.append($('<td class="category">' + categoryName + '</td>'));
      // 產品名稱
      if(product.name == PRODUCT_OTHERS) {
        // 自填欄位
        $row.append($('<td><input ' + defaultProps + ' data-role="product-name" type="text" required maxlength="64" placeholder="請自行輸入產品名稱" value="" class="temp__input" /></td>'));
      }
      else {
        $row.append($('<td>' + product.name + '</td>'));
      }
      if(rel == 'owner') {
        // 已有產品，照片欄位
        var imageTag = '';
        if(product.image) {
          var imagePath = '/storage/' + product.image;
          if(window.location.href.indexOf('huaweifans.com.tw') > -1) {
            imagePath = product.image.replace('register_event/MemberSurvey2022/', 'https://static.huaweifans.com.tw/mbs2022/');
          }
          imageTag = '<a data-fancybox="thumb" class="thumb" href="' + imagePath + '"><img src="' + imagePath + '" /></a>';
        }
        if(isExisting === true) {
          // 之前儲存的產品
          $row.append($('<td>' + (product.snimei || '')  + '</td>'));
          $row.append($('<td>' + imageTag + '</td>'));
        }
        else {
          // 新增產品
          // 已有產品，S/N/IMEI欄位
          $row.append($('<td><input ' + defaultProps + ' data-role="product-id" type="text" required maxlength="16" placeholder="此產品的S/N碼或者IMEI碼" value="' + (product.snimei || '') + '" class="temp__input" /></td>'));
          $row.append($('<td><label for="file_' + product.key + '" class="upload">上傳</label><div ' + defaultProps + ' id="thumb-' + product.key + '" class="thumb">' + imageTag + '</div><input id="file_' + product.key + '" ' + defaultProps + ' data-role="product-image" type="file" required accept=".jpg,.jpeg"  /></td>'));
        }
      }
      else {
        // 夢想清單，用途欄位
        var usage = product.usage;
        if(usage === null || product.category == 'none') {
          usage = '無';
        }
        $row.append($('<td><input ' + defaultProps + ' data-role="usage" type="text" required maxlength="100" placeholder="您想要如何使用此產品？" value="' + usage + '" class="temp__input" /></td>'));
      }
      // 刪除按鈕
      $row.append($('<td><a href="#" data-role="remove" data-rel="' + rel + '" data-key="' + product.key + '">刪除</a></td>'));
      $table.find('tbody').append($row);

      // 上傳按鈕
      $('input[type=file]').off('change').on('change', function (e) {
        var file = $(this).prop('files')[0];
        if (!file) return;

        var key = $(this).attr('data-key');
        var fileName = file.name;
        var size = Math.floor(file.size / 1024 / 1024);
        if (file.type != 'image/jpg' && file.type != 'image/jpeg') {
          alert('請上傳正確jpg格式圖片檔案。');
          return;
        };
        if(size > 5) {
          alert('上傳的檔案大小超過5MB限制。');
          return;
        }

        var reader = new FileReader();
        reader.onload = function (e) {
          console.log('FileReader onload');
          var product = findProductByKey('owner', key);
          product.image = this.result.substring(this.result.lastIndexOf(",") + 1);
          console.log(selectedProducts);
          $('#thumb-' + product.key).empty().append('<a data-fancybox="thumb" class="thumb" href="' + this.result + '"><img src="' + this.result + '" /></a>');
        };
        reader.readAsDataURL(file);
      });

      // 刪除按鈕
      $('a[data-role="remove"]').off('click').on('click', function(e) {
        e.preventDefault();
        var rel = $(this).data('rel');
        var key = $(this).data('key');
        removeProduct(rel, key);
      });

      // 產品名稱輸入欄位
      $('input[data-role="product-name"]').off('change').on('change', function(e) {
        var rel = $(this).data('rel');
        var key = $(this).data('key');
        var newName = $(this).val();
        var targetProduct = findProductByKey(rel, key);
        if(!targetProduct) {
          return;
        }
        // 檢查重複（跨產品類別）
        // 只在夢想清單檢查
        if(rel == 'wishlist') {
            if(findProductByName(rel, newName)) {
                fancyAlert('此產品「' + newName + '」已經在清單中了。');
                //return;
              }
        }
        // Update
        targetProduct.name = newName;
        $('*[data-key="' + key + '"]').attr('data-product', newName);
      });

      // S/N/IMEI輸入欄位
      $('input[data-role="product-id"]').off('change').on('change', function(e) {
        var rel = $(this).data('rel');
        var key = $(this).data('key');
        var productName = $(this).attr('data-product'); // $(this).data('product');
        var snimei = $(this).val();
        var targetProduct = findProductByKey(rel, key);
        if(!targetProduct) {
          return;
        }
        // 檢查格式
        if(!validateSnImei(snimei)) {
          fancyAlert('產品「' + productName + '」的S/N或者IMEI碼格式不正確。');
          //return;
        }
        else {
          // 檢查重複
          var existingProduct = findProductBySnImei(rel, snimei);
          if(existingProduct) {
            fancyAlert('產品「' + productName + '」的S/N或者IMEI碼與產品「' + existingProduct.name + '」重複。');
            //return;
          }
        }
        // Update
        targetProduct.snimei = snimei;
      });

      // 用途輸入欄位
      $('input[data-role="usage"]').off('change').on('change', function(e) {
        var rel = $(this).data('rel');
        var key = $(this).data('key');
        var productName = $(this).data('product');
        var text = $(this).val();
        // Update
        var targetProduct = findProductByKey(rel, key);
        if(!targetProduct) {
          return;
        }
        targetProduct.usage = text;
      });
    }

    // 刪除產品
    function removeProduct(rel, key) {
      var index = selectedProducts[rel].findIndex(function(p) { return p.key == key; });
      if(index < 0) {
        return;
      }
      selectedProducts[rel].splice(index, 1);

      var $table = $('#product-table-' + rel);
      $table.find('tr[data-key="' + key + '"]').remove();
    }

    // 產品類別選單
    $('select[data-role="product-category"]').on('change', function(e) {
      var $productList = $('#product-list-' + $(this).data('rel'));
      var category = $(this).val();
      if(!category) {
        $productList.empty().append('<option value="">--</option>');
        return;
      }
      // 連動產品選單
      $productList.empty().append('<option value="">請選擇產品</option>');
      for(var product of productCategories[category].list) {
        $productList.append('<option value="' + product + '">' + product + '</option>');
      }
      // 自填
      if(category != 'none') {
        $productList.append('<option value="' + PRODUCT_OTHERS + '">' + PRODUCT_OTHERS + '</option>');
      }
    });

    // 新增產品按鈕
    $('button[data-role="add-product"]').on('click', function(e) {
      var rel = $(this).data('rel');
      var product = $('#product-list-' + rel).val();
      if(!product) {
        fancyAlert('請選擇產品。');
        return;
      }
      addProduct(rel, product);
    });








      /**  =====================================================================  */
      $("#mission1_send .upload_chk").on('click',function(){

        let content = '<div class="msg"><h3>再完成一個任務即可抽購物金</h3><a href="#">繼續參與任務</a></div>';
         fancyAlert(content);        
      });    


      
      $("#mission2_send .upload_chk").on('click',function(){

        let content = '<div id="award"> <div class="left"><img src="assets/img/title.png"></div>'; 
            content += '<div id="award_box"><div class="cbox"></div></div>';
            content += '</div>';

       fancyAlert2(content);
      console.log("==>");
    });    






















    // Form processing
    var sending = false;
    $('#submit-button').on('click', function(e) {
      e.preventDefault();
      if (sending == true) {
          return;
      }
      if (true !== (result = app.validator.validateName($('#name').val()))) {
          fancyAlert(result.message);
          $('#name').focus();
          return;
      }
      if (true !== (result = app.validator.validateMobile($('#mobile').val()))) {
          fancyAlert(result.message);
          $('#mobile').focus();
          return;
      }
      if (true !== (result = app.validator.validateEmail($('#email').val()))) {
          fancyAlert(result.message);
          $('#email').focus();
          return;
      }
      if ($("#gender").val() === '') {
          fancyAlert('請選擇性別');
          $("#gender").focus();
          return;
      }
      if ($("#dob").val() === '') {
          fancyAlert('請輸入生日');
          $("#dob").focus();
          return;
      }
      if ($("select[name='county']").val() === '') {
          fancyAlert('請選擇縣市');
          $("select[name='county']").focus();
          return;
      }
      if (true !== (result = app.validator.validateAddres($('#address').val()))) {
          fancyAlert(result.message);
          $('#address').focus();
          return;
      }

      // Products
      if(selectedProducts['owner'].length == 0) {
        fancyAlert('您尚未填寫正在使用的產品資料。');
        return;
      }

      for(var product of selectedProducts['owner']) {
        if(product.name == '' || product.name == PRODUCT_OTHERS) {
          fancyAlert('請填寫所有已擁有產品的名稱。');
          return;
        }
        if(!product.image) {
          fancyAlert('請上傳所有已擁有產品的照片。');
          return;
        }
        if(!validateSnImei(product.snimei)) {
          fancyAlert('已擁有產品「' + product.name + '」的S/N或者IMEI碼未填寫或者格式不正確。');
          return;
        }
      }
      
      /*
      var duplicates = findDuplicateNames('owner');
      if(duplicates.length > 0) {
        fancyAlert('已擁有產品「' + duplicates[0].name + '」的名稱重複。');
        return;
      }
      */

      var duplicates = findDuplicateSnImei('owner');
      if(duplicates.length > 0) {
        fancyAlert('已擁有產品中有重複的S/N碼或IMEI碼「' + duplicates[0].snimei + '」。');
        return;
      }

      if(selectedProducts['wishlist'].length == 0) {
        fancyAlert('您尚未填寫夢想清單。若沒有夢想清單，請選擇「無」並按下「新增產品」。');
        return;
      }

      for(var product of selectedProducts['wishlist']) {
        if(product.name == '' || product.name == PRODUCT_OTHERS) {
          fancyAlert('請填寫所有夢想清單產品的名稱。');
          return;
        }
      }

      duplicates = findDuplicateNames('wishlist');
      if(duplicates.length > 0) {
        fancyAlert('夢想清單「' + duplicates[0].name + '」的名稱重複。');
        return;
      }

      if ($('#agree:checked').length == 0) {
          fancyAlert('請確認並勾選您已了解並同意本次活動個資蒐集利用之聲明');
          $("#agree").focus();
          return;
      }



      

      







      // Send data
      var $btn = $(this);
      sending = true;
      $btn.addClass('disabled').text('傳送中...');

      var formData = {
          name: $('#name').val(),
          mobile: $('#mobile').val(),
          email: $('#email').val(),
          gender: $('#gender').val(),
          dob: $('#dob').val(),
          county: $("select[name='county']").val(),
          area: $("select[name='district']").val(),
          address: $('#address').val(),
          has_huawei_id: $('#has_huawei_id')[0].checked ? 'y' : 'n',
          has_huawei_cloud: $('#has_huawei_cloud')[0].checked ? 'y' : 'n',
          has_app_gallery: $('#has_app_gallery')[0].checked ? 'y' : 'n',
          products: selectedProducts,
      };

      var jqxhr = $.ajax({
            url: app.config.API_BASE + '/events/member-survey-2022/entries',
            method: 'POST',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(formData),
            headers: app.user.getAuthHeaders()
        }).done(function (response, textStatus, jqXHR) {
            fancyAlert('您的活動資料已成功送出。謝謝您。');
            sending = false;
            $btn.removeClass('disabled').text('確認送出');;
        }).fail(function (jqXHR, textStatus, errorThrown) {
            sending = false;
            $btn.removeClass('disabled').text('確認送出');;
            var response = $.parseJSON(jqXHR.responseText);
            switch (jqXHR.status) {
                case 400:
                    switch (response.code) {
                        case 4000:
                            if (response.data.name != undefined) {
                                fancyAlert('姓名未填寫或者格式不正確。');
                                $('#name').focus();
                            }
                            else if (response.data.mobile != undefined) {
                                fancyAlert('手機號碼格式不正確。');
                                $('#mobile').focus();
                            }
                            else if (response.data.email != undefined) {
                                fancyAlert('電子郵件信箱格式不正確。');
                                $('#email').focus();
                            }
                            else {
                                fancyAlert('很抱歉，目前無法處理您的資料。');
                            }
                            break;
                        case 4001:
                            fancyAlert(response.message || '已擁有產品的S/N或者IMEI碼無效，或者已被登錄過。');
                            break;
                        case 4020:
                            fancyAlert('很抱歉，本活動登錄時間已截止。');
                            break;
                        default:
                            fancyAlert('很抱歉，目前無法處理您的資料。');
                    }
                    break;
                case 413:
                    fancyAlert('上傳的檔案大小超過限制。');
                    break;
                case 419:
                    fancyAlert('您停留在網頁閒置時間過久。請重新整理網頁後再送出資料。');
                    break;
                case 429:
                    fancyAlert('送出資料次數過於頻繁，或者發送次數已超出本日限制。');
                    break;
                default:
                    fancyAlert('很抱歉，目前無法處理您的資料。');
            }
        });
    });
});