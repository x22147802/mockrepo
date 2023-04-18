$(document).ready(function () {

    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    // add to cart
    $('.add_to_cart').click(function () {
        var recipe_id = $(this).attr('data_recipe_value');
        var user_id = $(this).attr('data_user_id');
        var cart_recipe_id = $(this).attr('data_cart_recipe_id');
        var cart_id = $(this).attr('data_cart_id');
        servings_count = $('.servings_active').attr('data_servings_count')

        $.ajax({
            url: '/ajax_add_to_cart',
            type: 'POST',
            data: { recipe_id: recipe_id, user_id: user_id, cart_recipe_id: cart_recipe_id, cart_id: cart_id, servings_count: servings_count },
            dataType: 'json',
            beforeSend: function () {
                $('#cover-spin').show(0);
            },
            success: function (response) {
                $('#cover-spin').hide();
                if (response.success == false) {
                    $("#failure-notification-message").empty().append(response.message);
                    $('#failure_notification_trigger').trigger('click');

                } else {
                    $("#success-notification-message").empty().append(response.message);
                    $('#success_notification_trigger').trigger('click');

                    $('.remove_ingredient').attr('data_entry_in', response.entry_in);
                    $('.add_to_cart').hide();
                    $('.view_cart').show();
                }
            }

        });

    });

    // quantity change
    $('.add').click(function (e) {
        // Stop acting like a button
        e.preventDefault();
        var cart_recipe_id = $(this).attr('data_id');
        // Get its current value
        var currentVal = parseInt($('.cart_item_' + cart_recipe_id).val());
        // console.log('add click' +currentVal);
        // If is not undefined
        if (!isNaN(currentVal)) {
            // Increment
            $('.cart_item_' + cart_recipe_id).val(currentVal + 1);
            var new_qty = $('.cart_item_' + cart_recipe_id).val();
            var idd = cart_recipe_id;
            //  console.log(new_qty);
            //  console.log(idd);

            $.ajax({
                url: '/ajax_update_servings',
                type: 'POST',
                data: { id: idd, qty: new_qty },
                dataType: 'json',
                beforeSend: function () {
                    $('#cover-spin').show(0);
                },
                success: function (data) {
                    console.log(data);
                    location.reload();
                }
            });


        }
    });

    // This button will decrement the value till 0
    $('.subtract').click(function (e) {
        // Stop acting like a button
        e.preventDefault();
        var cart_recipe_id = $(this).attr('data_id');
        // Get its current value
        var currentVal = parseInt($('.cart_item_' + cart_recipe_id).val());
        $('.cart_item_' + cart_recipe_id).val(currentVal - 1);

        // If it isn't undefined or its greater than 0
        if (!isNaN(currentVal) && currentVal > 1) {
            // Decrement one
            $('.cart_item_' + cart_recipe_id).val(currentVal - 1);
            var new_qty = $('.cart_item_' + cart_recipe_id).val();
            var idd = cart_recipe_id;
            //  console.log(new_qty);
            //  console.log(idd);

            $.ajax({
                url: '/ajax_update_servings',
                type: 'POST',
                data: { id: idd, qty: new_qty },
                dataType: 'json',
                beforeSend: function () {
                    $('#cover-spin').show(0);
                },
                success: function (data) {
                    console.log(data);
                    location.reload();
                }
            });
        }
        if (currentVal === 1) {
            var cart_recipe_id = $(this).attr('data_id');
            var cart_id = $(this).attr('data_cart_id');
            $.ajax({
                type: "POST",
                url: "/ajax_remove_cart_recipe",
                data: { cart_recipe_id: cart_recipe_id, cart_id: cart_id },
                dataType: 'json',
                beforeSend: function () {
                    $('#cover-spin').show(0);
                },
                success: function (data) {
                    console.log(data);
                    location.reload();
                }

            });

        }
    });

    // ajax submit location address
    $('#general_form').on('submit', function (e) {
        e.preventDefault();

        var post_url = $('#post_url').attr('href');
        console.log(post_url);

        $.ajax({
            type: "POST",
            url: post_url,
            data: new FormData(this),
            dataType: 'json',
            processData: false,
            contentType: false,
            beforeSend: function () {
                $('#cover-spin').show(0);
            },
        })
            .done(function (data) {
                // log data to the console so we can see
                $('#cover-spin').hide();

                if (data.success == true) {
                    $("#success-notification-message").empty().append(data.message);
                    $('#success_notification_trigger').trigger('click');
                }

                if (data.success == false) {
                    $("#failure-notification-message").empty().append(data.message);
                    $('#failure_notification_trigger').trigger('click');
                }

                if (data.reload == 'Yes') {
                    setTimeout(function () {
                        location.reload();
                    }, 2000);
                }

                if (data.redirect_url != null) {
                    setTimeout(function () {
                        window.location.href = data.redirect_url;
                    }, 2000);
                }
            });

    });

    $('#clear_places_input').on('click', function () {
        $('.placeSearchInput').val('');
    });

    $('#profile_update_form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            url: '/ajax_update_profile',
            type: 'POST',
            data: new FormData(this),
            dataType: 'json',
            processData: false,
            contentType: false,
            cache: false
        })
            .done(function (data) {
                console.log(data);
                if (data.success === false) {
                    $('#failure-notification-message').empty().append(data.message);
                    $('#failure_notification_trigger').trigger('click');
                }

                if (data.success === true) {
                    $('#success-notification-message').empty().append(data.message);
                    $('#success_notification_trigger').trigger('click');
                }

                if (data.reload === 'Yes') {
                    setTimeout(() => {
                        location.reload();
                    }, 2000);
                }

                if (data.redirect_url !== '') {
                    setTimeout(() => {
                        window.location.href = data.redirect_url;
                    }, 2000);
                }

            });
    });

    $('#change_photo').on('click', function () {
        $('#user_image_input').trigger('click');
    });


    $('#save_recipe').on('click', function () {
        var recipe_id = $(this).attr('data-recipe-id');

        if (recipe_id !== '' && recipe_id !== undefined && recipe_id !== null) {
            $.ajax({
                url: '/ajax_save_recipe',
                type: 'POST',
                data: { id: recipe_id },
                dataType: 'json'
            })
                .done(function (data) {
                    console.log(data);
                    if (data.success === false) {
                        $('#failure-notification-message').empty().append(data.message);
                        $('#failure_notification_trigger').trigger('click');
                    }

                    if (data.success === true) {
                        $('#success-notification-message').empty().append(data.message);
                        $('#success_notification_trigger').trigger('click');
                    }

                    if (data.reload === 'Yes') {
                        setTimeout(() => {
                            location.reload();
                        }, 2000);
                    }

                    if (data.redirect_url !== '') {
                        setTimeout(() => {
                            window.location.href = data.redirect_url;
                        }, 2000);
                    }

                });
        }
    });
    
    $('#focus_search').on('input', function () {

        var val= $(this).val();
        if(val!='' && val!= ' ')
        {
            $.ajax({
                url:'/ajax_search_products',
                type:'POST',
                data:{searchParam:val},
                dataType:'json',
            })
            .done(function(data){
    
                if (data.success == false) {
                 $('#failure-notification-message').empty().append(data.message);
                 $('#failure_notification_trigger').trigger('click');
                }

                if (data.success == true) {
                  $('#recipes_menu_div').hide();
                  $('#search_result_div').empty().show().append(data.message);
                }
    
                if (data.refresh_page == 'Yes') {
                    setTimeout(function () {
                        location.reload();
                    }, 2000);
                }
    
                if (data.redirect_url != null) {
                    setTimeout(function () {
                        window.location.href = data.redirect_url;
                    }, 2000);
                }
    
    
    
            }); 
        }else{
           $('#search_result_div').empty();
           $('#search_result_div').hide();
           $('#recipes_menu_div').show();

        }
        
    });

    // quanity buttons script 
    $(document).on('click','[data-quantity="plus"]',function(e){
        // Stop acting like a button
        e.preventDefault();
        // Get the field name
        fieldName = $(this).attr('data-field');
        // Get its current value
        var currentVal = parseInt($('input[name='+fieldName+']').val());
        // If is not undefined
        if (!isNaN(currentVal)) {
            // Increment
            $('input[name='+fieldName+']').val(currentVal + 1);
        } else {
            // Otherwise put a 0 there
            $('input[name='+fieldName+']').val(1);
        }
    });
    // This button will decrement the value till 0
    $(document).on('click','[data-quantity="minus"]',function(e){
        alert('clicked');
        // Stop acting like a button
        e.preventDefault();
        // Get the field name
        fieldName = $(this).attr('data-field');
        // Get its current value
        var currentVal = parseInt($('input[name='+fieldName+']').val());
        // If it isn't undefined or its greater than 0
        if (!isNaN(currentVal) && currentVal > 1) {
            // Decrement one
            $('input[name='+fieldName+']').val(currentVal - 1);
        } else {
            // Otherwise put a 0 there
            $('input[name='+fieldName+']').val(1);
        }
    });


    // for add to cart prod info
    $(document).on('click','.menu_product',function(e){
        e.preventDefault();
        var pId= $(this).attr('data-product-id');
        const csrf_token= getCookie('csrftoken');

        console.log(pId);

        if(pId)
        {
            $('#preloader').removeClass('preloader-hide');
            $.ajax({
                url:'/menu/ajax_build_cart_products',
                type:'POST',
                data:{p_id:pId,},
                beforeSend: function(xhr) {
                    if (!this.crossDomain) {
                        xhr.setRequestHeader("X-CSRFToken", csrf_token);
                    }
                },
                dataType:'json'
            })
            .done(function(data){
                $('#preloader').addClass('preloader-hide');
    
                if (data.success == false) {
                 $('#failure-notification-message').empty().append(data.message);
                 $('#failure_notification_trigger').trigger('click');
                }

                if (data.success == true) {
                
                    $('#p_name').empty().append(data.product_name);
                    $('.alert-text').empty();
                    $('#cart-button').removeAttr('disabled');
                    $('#quant_inp').val('1');
                    $('#product_id').val(data.product_id);
                    $('#current_price').val(data.product_price);
                   
                  $('#t_modal').trigger('click');
                }
    
                if (data.refresh_page == 'Yes') {
                        location.reload();
                }
    
                if (data.redirect_url != null) {
                    setTimeout(function () {
                        window.location.href = data.redirect_url;
                    }, 2000);
                }
    
    
    
            });
        }
    });

    // add to cart functionality
    $(document).on('click','#cart-button',function(e){
        e.preventDefault();
        
        // values to be posted
        var cP= $('#current_price').val();
        var pId= $('#product_id').val();
        var qty= $('#quant_inp').val();
        const csrf_token= getCookie('csrftoken');

        if(cP && pId)
        {
            $('#preloader').removeClass('preloader-hide');
            $.ajax({
                url:'/menu/ajax_add_to_cart',
                type:'POST',
                data:{c_p:cP,p_id:pId,quant:qty},
                beforeSend: function(xhr) {
                    if (!this.crossDomain) {
                        xhr.setRequestHeader("X-CSRFToken", csrf_token);
                    }
                },
                dataType:'json'
            })
            .done(function(data){

                $('#preloader').addClass('preloader-hide');
    
                if (data.success == false) {
                 $('#failure-notification-message').empty().append(data.message);
                 $('#failure_notification_trigger').trigger('click');
                }

                if (data.success == true) {
                    $("#success-notification-message").empty().append(data.message);
                    $('#success_notification_trigger').trigger('click');
                }
    
                if (data.refresh_page == 'Yes') {
                    location.reload();
                }
    
                if (data.redirect_url != null) {
                    setTimeout(function () {
                        window.location.href = data.redirect_url;
                    }, 2000);
                }
    
    
    
            }); 
        }else{

            $('#failure-notification-message').empty().append('Something went wrong! please try again later');
            $('#failure_notification_trigger').trigger('click');

            setTimeout(() => {
                location.reload();
            }, 2000);
        }
    });
 
    // cart page quantity
    $('.dec_qty').on('click',function(e){
        e.preventDefault();

        var pId= $(this).attr('data-cp-id');
        const csrf_token= getCookie('csrftoken');
        var qty= $('#quant_inp_'+pId).val();

        if(pId && qty > 1)
        {
            $('#preloader').removeClass('preloader-hide');
            $.ajax({
                url:'/cart/ajax_dec_qty',
                type:'POST',
                data:{p_id:pId},
                beforeSend: function(xhr) {
                    if (!this.crossDomain) {
                        xhr.setRequestHeader("X-CSRFToken", csrf_token);
                    }
                },
                dataType:'json'
            })
            .done(function(data){

                $('#preloader').addClass('preloader-hide');
    
                if (data.success == false) {
                 $('#failure-notification-message').empty().append(data.message);
                 $('#failure_notification_trigger').trigger('click');
                }

                if (data.success == true) {
                    $("#success-notification-message").empty().append(data.message);
                    $('#success_notification_trigger').trigger('click');
                }
    
                if (data.refresh_page == 'Yes') {
                    location.reload();
                }
    
                if (data.redirect_url != null) {
                    setTimeout(function () {
                        window.location.href = data.redirect_url;
                    }, 2000);
                }
    
            });   
        }
    });

    $('.inc_qty').on('click',function(e){
        e.preventDefault();

        var pId= $(this).attr('data-cp-id');
        const csrf_token= getCookie('csrftoken');

        if(pId)
        {
            $('#preloader').removeClass('preloader-hide');
            $.ajax({
                url:'/cart/ajax_inc_qty',
                type:'POST',
                data:{p_id:pId},
                beforeSend: function(xhr) {
                    if (!this.crossDomain) {
                        xhr.setRequestHeader("X-CSRFToken", csrf_token);
                    }
                },
                dataType:'json'
            })
            .done(function(data){
                $('#preloader').addClass('preloader-hide');
    
                if (data.success == false) {
                 $('#failure-notification-message').empty().append(data.message);
                 $('#failure_notification_trigger').trigger('click');
                }

                if (data.success == true) {
                    $("#success-notification-message").empty().append(data.message);
                    $('#success_notification_trigger').trigger('click');
                }
    
                if (data.refresh_page == 'Yes') {
                    location.reload();
                }
    
                if (data.redirect_url != null) {
                    setTimeout(function () {
                        window.location.href = data.redirect_url;
                    }, 2000);
                }
    
            });   
        }
    });

    // delete cart product
    $('.dlt-prod').on('click',function(e){
        e.preventDefault();
        var pId= $(this).attr('data-p-id');
        const csrf_token= getCookie('csrftoken');

        if(pId)
        {
            $('#preloader').removeClass('preloader-hide');
            $.ajax({
                url:'/cart/ajax_rm_cart_prod',
                type:'POST',
                data:{p_id:pId},
                beforeSend: function(xhr) {
                    if (!this.crossDomain) {
                        xhr.setRequestHeader("X-CSRFToken", csrf_token);
                    }
                },
                dataType:'json'
            })
            .done(function(data){
                $('#preloader').addClass('preloader-hide');
    
                if (data.success == false) {
                 $('#failure-notification-message').empty().append(data.message);
                 $('#failure_notification_trigger').trigger('click');
                }

                if (data.success == true) {
                    $("#success-notification-message").empty().append(data.message);
                    $('#success_notification_trigger').trigger('click');
                }
    
                if (data.refresh_page == 'Yes') {
                    location.reload();
                }
    
                if (data.redirect_url != null) {
                    setTimeout(function () {
                        window.location.href = data.redirect_url;
                    }, 2000);
                }
    
            });   
        }
       


    });


    // order now
    $('.o_btn').on('click',function(e){
        e.preventDefault();
        var totalPrice= $(this).attr('data-total-price');
        var cartId= $(this).attr('data-cart-id');
        const csrf_token= getCookie('csrftoken');

        if(totalPrice, cartId)
        {
            $('#preloader').removeClass('preloader-hide');
            $.ajax({
                url:'/cart/ajax_order_cart_products',
                type:'POST',
                data:{tP:totalPrice, cId:cartId},
                beforeSend: function(xhr) {
                    if (!this.crossDomain) {
                        xhr.setRequestHeader("X-CSRFToken", csrf_token);
                    }
                },
                dataType:'json'
            })
            .done(function(data){
                $('#preloader').addClass('preloader-hide');
    
                if (data.success == false) {
                 $('#failure-notification-message').empty().append(data.message);
                 $('#failure_notification_trigger').trigger('click');
                }

                if (data.success == true) {
                    $("#success-notification-message").empty().append(data.message);
                    $('#success_notification_trigger').trigger('click');
                }
    
                if (data.refresh_page == 'Yes') {
                    setTimeout(() => {
                     location.reload();
                    }, 3000);
                }
    
                if (data.redirect_url) {
                    setTimeout(function () {
                        window.location.href = data.redirect_url;
                    }, 2000);
                }
    
            });   
        }




    });


    // display ordered cart products
    $('.getList').on('click',function(e){
        e.preventDefault();
        var cId= $(this).attr('data-cart-id');
        var oId= $(this).attr('data-order-id');
        const csrf_token= getCookie('csrftoken');

        if(cId && oId)
        {
            $('#preloader').removeClass('preloader-hide');
            $.ajax({
                url:'/orders/ajax_get_cart_products',
                type:'POST',
                data:{c_id:cId,o_id: oId},
                beforeSend: function(xhr) {
                    if (!this.crossDomain) {
                        xhr.setRequestHeader("X-CSRFToken", csrf_token);
                    }
                },
                dataType:'json'
            })
            .done(function(data){
                $('#preloader').addClass('preloader-hide');
    
                if (data.success == false) {
                 $('#failure-notification-message').empty().append(data.message);
                 $('#failure_notification_trigger').trigger('click');
                }

                if (data.success == true) {
                    if(data.output && data.order_id)
                    {
                        $('.collapsed_menu_'+data.order_id).empty().append(data.output);
                    }
                }
    
                if (data.refresh_page == 'Yes') {
                    location.reload();
                }
    
                if (data.redirect_url != null) {
                    setTimeout(function () {
                        window.location.href = data.redirect_url;
                    }, 2000);
                }
    
            });   
        }


    });
});