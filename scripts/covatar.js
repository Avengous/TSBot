registerPlugin({
    name: 'Covatar - Cover 2 Avatar',
    version: '1.0',
    description: 'This script will set the avatar from the cover info of the current track.',
    author: 'Michael Friese <michael@sinusbot.com>',
    vars: {}
}, function(sinusbot, config) {
    sinusbot.on('track', function(ev) {
        if (!ev.thumbnail) return;
        if (!sinusbot.setAvatarFromTrack()) {
            sinusbot.setDefaultAvatar();
        }
    });
});
