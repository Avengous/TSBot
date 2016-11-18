registerPlugin({
    name: 'CoverArt',
    version: '1.0',
    description: 'Automagically downloads album art from theaudiodb.com.',
    author: 'Michael Friese <michael@sinusbot.com>',
    vars: {}
}, function(sinusbot, config) {
    var invalids = [];
    sinusbot.on('track', function(ev) {
        if (invalids.indexOf(ev.uuid) >= 0) return;
        if (ev.title != '' && ev.artist != '' && !ev.thumbnail && (ev.type === '' || ev.type == 'file')) {
            sinusbot.log('Searching for thumbnail for ' + ev.artist + ' - ' + ev.title);
            var out = sinusbot.http({ method: 'GET', url: 'http://www.theaudiodb.com/api/v1/json/1/searchtrack.php?s=' + encodeURIComponent(ev.artist) + '&t=' + encodeURIComponent(ev.title) });
            if (out) {
                var sres = JSON.parse(out);
                if (sres && sres.track && sres.track.length > 0) {
                    var track = sres.track[0];
                    http({ method: 'GET', url: 'http://www.theaudiodb.com/api/v1/json/1/album.php?m=' + track.idAlbum }, function (err, res) {
                        if (res && res.data) {
                            var ares = JSON.parse(res.data);
                            if (ares && ares.album && ares.album.length > 0) {
                                var album = ares.album[0];
                                if (sinusbot.downloadTrackThumbnail(ev.uuid, album.strAlbumThumb)) {
                                    sinusbot.log('Updated thumbnail!');
                                } else {
                                    sinusbot.log('Thumbnail failed!');
                                    invalids.push(ev.uuid);
                                }
                            } else {
                                invalids.push(ev.uuid);
                            }
                        } else {
                            invalids.push(ev.uuid);
                        }
                    });
                } else {
                    invalids.push(ev.uuid);
                }
            } else {
                invalids.push(ev.uuid);
            }
        }
    });
});
