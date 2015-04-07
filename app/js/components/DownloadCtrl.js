/**
 * Created by Daniel on 4/7/2015.
 */
app.controller('HeaderCtrl', function DownloadCtrl($scope) {
    var WebTorrent = require('webtorrent'),
        fs = require('fs'),
        path = require('path'),
        client = new WebTorrent();

    var download_dir = "./download";
    var magnetUri = 'magnet:?xt=urn:btih:9D3EE62DA76365E5AAB6FB616C459F5150271766&dn=sia+1000+forms+of+fear+2014+cbr+320+kbps+aryan+l33t&tr=udp%3A%2F%2Fopen.demonii.com%3A1337%2Fannounce';

    client.download(magnetUri, function (torrent) {
        // Got torrent metadata!
        console.log('Torrent info hash:', torrent.infoHash);

        //
        if (!fs.existsSync(download_dir)) {
            fs.mkdirSync(download_dir);
        }
        var download_path = path.join(download_dir, torrent.infoHash + Date.now());
        if (!fs.existsSync(download_path)) {
            fs.mkdirSync(download_path);
        }

        torrent.files = torrent.files
            .filter(function (file) {
                // Ignore files we don't want
                return ['.nfo', '.txt'].indexOf(path.extname(file.name)) === -1;
            })
            .map(function (file) {
                // Stream each file to the disk
                file.download_progress = 0;
                var source = file.createReadStream()
                    .on('readable', function () {
                        console.log('readable!');
                    })
                    .on('data', function (data) {
                        file.download_progress += data.length;
                        file.progress = Math.round(file.download_progress / this.length * 100) + '%';
                        console.log('Data!', file.name, Math.round(file.download_progress / this.length * 100) + '%');
                        $scope.$apply();
                    })
                    .on('error', function (err) {
                        console.error('Error', err);
                    })
                    .on('end', function () {
                        console.log('All done!');
                        // Try to find the album cover
                        if (['.png', '.jpg', '.jpeg'].indexOf(path.extname(file.name)) !== -1 && file.name.toLowerCase().indexOf('cover') !== -1) {
                            torrent.album_cover = file.path;
                            $scope.$apply();
                        }
                    })
                    .on('finish', function () {
                        console.log('All Finished!');
                    })
                    .on('close', function () {
                        console.log('close!');
                    });

                file.path = path.join(download_path, file.name);
                file.writeStream = fs.createWriteStream(file.path);
                source.pipe(file.writeStream);

                return file;
            });

        $scope.torrent = torrent;
        $scope.$apply();
    })
});