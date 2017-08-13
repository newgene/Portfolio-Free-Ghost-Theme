/**
 * Main JS file for Portfolio behaviours
 */
 //constrcut the article html
function construct_html(href, title, describe,tags) {
    url1 = '<article class="post tag-sync_sulab post__wrapper" data-cols="4">' + '<div class="post__wrapper_helper post__wrapper_helper--notloaded el__transition post__wrapper_helper--hover">' + '<div class="post__preview el__transition">' + '<header class="post__header">' + '<h2 class="post__title">' + '<a href='

    url2 = ' class="post__link post__title_link"><span>'

    url3 = '</span></a></h2></header><p class="post__excerpt"><a href='
    url4 = ' class="post__link post__readmore">'

    url5 = '</a></p></div><footer class="post__meta"><ul class="post__tags">'
    url6 = '</ul></footer></div></article>'
    html = url1 + href + url2 + title + url3 + href + url4 + describe + url5
    for(var i=0; i < tags.length; i++) {
      if (tags[i] != 'sync_sulab') {    // skip internal sync_sulab tag
        html += construct_tag(tags[i]);
      }
    };
    html += url6;
    return html
}
//construct the html for the tag part
function construct_tag(tag_name){
  render_tag = '<li class="post__tag"><a class="post__link post__tag_link">' + tag_name + '</a> </li>'
  return render_tag
}
/*globals jQuery, document */
(function ($) {
    "use strict";

    $(document).ready(function(){
        // display 4 articels at a time given the page number
        function show_post_by_page(page, data){
            $.each(data, function(index, item){
                if (index >= page*4-4 && index < page*4){
                    var href = item['link'];
                    var title = item['title'];
                    var content = item['content'];
                    var describe = content.replace(/(<([^>]+)>)/ig,"").slice(0,121) + '...';
                    var tags = item['categories'];
                    //console.log(tags);
                    $("#news").append(construct_html(href, title, describe, tags))
                }
            })
        }
        //add fancy transition effects to the articles when loading
        function add_transition(){
            var blocks = [];
            $('.post__wrapper_helper--notloaded').each(function(i, block) {
              blocks.push(block);
            });

            var add_class = function(block, class_name, delay) {
              setTimeout(function() {
                $(block).addClass(class_name);
              }, delay);
            };

            for(var i = 0; i < blocks.length; i++) {
              add_class(blocks[i], 'post__wrapper_helper--animated', i * 200);
            }
        }
        /*given an array of articles, and a specific tag to filter
          return an array of articles containing the tag
        */
        function filter_post_by_tag(posts, tag) {
          var results = [];
          $.each(posts, function(index, item){
            if (item['categories'].indexOf(tag) != -1){
              results.push(item);
            }
          });
          return results
        }
        // deal with issues when user click the tag
        function click_tag(){
          $('.post__tag_link').click(function(){
            /*
            When clicking on one of the tags, only tag related articles will be shown
            remove unrelevant stuff, e.g. header part, exisiting articles, etc.
            */
            $(".main__header, article, .rslides_container, .whatsnew__div").remove();
            $("#newer").hide();
            tag_doc = filter_post_by_tag(mygene_doc, this.innerHTML);
            //reset the current page to 1
            current_page = 1;
            // calculate the number of relevant articles, and insert an h2 title on top of articles
            $(".menu").after('<h2 class="main__header">Tag archive: <span class="main__header--tagname">' + this.innerHTML + ' ' + '(' + tag_doc.length + ')</span></h2>')
            //recalculate the total number of pages
            page_num = Math.ceil(tag_doc.length/4);
            $('#page').text('page ' + current_page + ' of ' + page_num);
            //If only one page exists, then hide the "older" button
            if (page_num == 1) {
              $("#older").hide();
            } else {
              $("#older").show();
            }
            show_post_by_page(current_page, tag_doc);
            add_transition();
            //self call function
            click_tag();
          })
        }
        var mygene_doc;
        var tag_doc;
        var page_num;
        //rss2json to get the articles
        var current_page = 1;
        //initialize
        $.getJSON(feed_rss2json_url, {
            format: 'json'
         }).done(function(data){
            mygene_doc = data.items;
            page_num = Math.ceil(mygene_doc.length/4);
            $('#page').text('page ' + current_page + ' of ' + page_num);
            $("#newer").hide();
            if (page_num == 1) {
              $("#older").hide();
            } else {
              $("#older").show();
            }
            show_post_by_page(current_page, mygene_doc);
            add_transition();
            click_tag();
            });
         //when clicking on the old button, remove existing articles, and display older articles
        $("#older").click(function(){
            $("article").remove();
            current_page += 1;
            if (current_page == page_num){
                $("#older").hide();
            };
            $("#newer").show();
            $("#page").text('page ' + current_page + ' of ' + page_num);
            show_post_by_page(current_page, mygene_doc);
            add_transition();
            click_tag();
        });
        //when clicking on the newer button, remove existing articles, and display newer ones
        $("#newer").click(function(){
            $("article").remove();
            current_page -= 1;
            $("#older").show();
            if (current_page == 1){
                $("#newer").hide();
            }
            else{
                $("#newer").show();
            }
            $("#page").text('page ' + current_page + ' of ' + page_num);
            show_post_by_page(current_page, mygene_doc);
            add_transition();
            click_tag();
        });

        // move main image to header
        if(
        	$('.post-template').length > 0 || 
        	$('.page-template').length > 0
        ) {
        	var featured_image = $('img[alt="featured-image"]');
        	var featured_video = $('.post__content iframe:first-child')
        	// check if the featured image exists
        	if(featured_video && featured_video.length > 0) {
        		featured_video.appendTo($('.post__media'));
        	}
        }

        if(
        	$(document.body).hasClass('home-template') ||
        	$(document.body).hasClass('archive-template') ||
        	$(document.body).hasClass('tag-template') ||
        	$(document.body).hasClass('author-template')
        ) {
          // get the post images
        /*
          var blocks = [];
          
          $('.post__wrapper_helper--notloaded').each(function(i, block) {
          	blocks.push(block);
          });
          
          var add_class = function(block, class_name, delay) {
          	setTimeout(function() {
          		$(block).addClass(class_name);
          	}, delay);
          };
          
          for(var i = 0; i < blocks.length; i++) {
          	add_class(blocks[i], 'post__wrapper_helper--animated', i * 200);
          }
          */
          /*
          $('.post__wrapper_helper--notloaded').each(function(i, wrapper) {
            wrapper = $(wrapper);
            var img = wrapper.find('.post__image_to_load')[0];
            if(img) {
              // wait for the images
              var timer = setInterval(function() {
                // when the image is laoded
                if(img.complete) {
                  // stop periodical calls
                  clearInterval(timer);
                  // generate the image wrapper
                  var src = $(img).attr('src');
                  jQuery(img).remove();
                  var img_container = $('<div class="post__image el__transition_long" style="background-image: url(\''+src+'\')"></div>');
                  img_container.appendTo(wrapper);
                  wrapper.removeClass('post__wrapper_helper--notloaded');
                  // add class with delay
                  setTimeout(function() {
                    img_container.addClass('post__image--loaded');
                  }, 250);
                }          
              }, 500);
              // 
              wrapper.click(function() {
              	if(wrapper.find('.post__title_link').length) {
              		window.location.href = wrapper.find('.post__title_link').attr('href');
              	}
              });
              // add necessary mouse events
              wrapper.mouseenter(function() {
                wrapper.addClass('post__wrapper_helper--hover');
              });

              wrapper.mouseleave(function() {
                wrapper.removeClass('post__wrapper_helper--hover');
              });
            } else {
              // where there is no image - display the text directly
              wrapper.addClass('post__wrapper_helper--hover');
            }
          });
          */
        }
        // fit videos
        $(".post-header").fitVids();
        $(".post-content").fitVids();
        // menu behaviour
        var main_menu = $(".menu");
        main_menu.click(function() {
          if(main_menu.hasClass("menu--open")) {
            main_menu.removeClass("menu--open");
          } else {
            main_menu.addClass("menu--open");
          }
        });
    });
}(jQuery));