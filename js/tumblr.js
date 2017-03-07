
var tumblr = {
	loadPosts: function(blogName, type, limit) {
		var url;
		console.log(blogName);
		if (blogName.includes(".com")) {
			// don't assume .tumblr.com
			if (blogName.includes("://")) {
				// they included the http:// thing
				url = blogName;
			} else {
				// they included the https:// thing
				url = "https://" + blogName; 
			}
		} else {
			url = "https://" + blogName + ".tumblr.com";
		}

		if (url.slice(-1) == "/") {
			// Remove the last /
			url = url.substr(0, url.length - 1);
		}

		url = url + "/api/read/json?num=" + limit + "&type=" + type + "&callback=?";
		console.log("[tumblr] Requesting URL: " + url);
		return new Promise(function(resolve, reject) {
			if (!blogName || !type || !limit) {
				reject("loadPosts>> Invalid args: Expected non-null blogName, type, limit.");
			} else {
				$.getJSON(url,function(json){
					if (!json) {
						reject("Server responded with bad JSON.");
					} else {
						resolve(json);
					}
				});
			}
		});
	},

	loadPhotoPosts: function(blogName, limit) {
		return tumblr.loadPosts(blogName, "photo", limit);
	},

	/* Loads 'limit' photo URLs from blogName.tumblr.com */
	loadRecentPhotoURLs: function(blogName, limit) {
		return new Promise(function(resolve, reject) {
			tumblr.loadPhotoPosts(blogName, limit).then(function(response) {
				var posts = response.posts;
				if (!posts) {
					reject("Unknown response format.");
				} else {
					var urls = $.map(posts, function(post) {
						var p = {};
						p["src"] = post['photo-url-400'];
						p["caption"] = post['slug'];
						return p;
					});
					console.log("Loaded " + urls.length + " image urls.");
					resolve(urls);
				}
			});
		});
	}
};


