/**
 * Created by Daniel on 4/7/2015.
 */
app.factory('dlm', function ($q) {

    var fs = require('fs'),
        path = require('path'),
        DOWNLOAD_DIR = path.resolve("./download"),
        queue = [],
        WebTorrent = require('webtorrent'),
        client = new WebTorrent();

    /**
     *
     */
    function init() {
        createFolder(DOWNLOAD_DIR, function (err, res) {
            console.log(err, res);
        });
    }

    /**
     *
     * @param magent
     */
    function add(magent) {
        var item = _.findWhere(queue, {magent:magent});
        if (item) {
            return item.defer.promise;
        }

        var defer = $q.defer();
        item = {
            magnet: magent,
            defer: defer,
            files: {},
            status: 'initializing'
        };

        client.add(magent, function (torrent) {
            // Got torrent metadata!
            console.log('Torrent info hash:', torrent.infoHash);

            createFolder(path.resolve(DOWNLOAD_DIR, Date.now() + torrent.name + '_' + torrent.infoHash), function (err, torrentDir) {
                if (err) {
                    queue[magent].status = 'failed';
                    return;
                }

                item.status = "downloading";

                torrent.files
                    .filter(function (file) {
                        // Ignore files we don't want
                        return ['.nfo', '.txt', '.pdf'].indexOf(path.extname(file.name)) === -1;
                    })
                    .map(function (file) {
                        item.files[file.name] = {};

                        // Stream each file to the disk
                        file.download_progress = 0;
                        var source = file.createReadStream()
                            .on('data', function (data) {
                                file.download_progress += data.length;
                                file.progress = Math.round(file.download_progress / this.length * 100) + '%';
                                item.files[file.name].progress = file.progress;
                                //console.log('Data!', file.name, Math.round(file.download_progress / this.length * 100) + '%');
                                defer.notify();
                            })
                            .on('error', function (err) {
                                console.error('Error', err);
                                defer.reject();
                            })
                            .on('end', function () {
                                console.log('All done!');
                                // Try to find the album cover
                                if (['.png', '.jpg', '.jpeg'].indexOf(path.extname(file.name)) !== -1 && file.name.toLowerCase().indexOf('cover') !== -1) {
                                    torrent.album_cover = file.path;
                                }
                            })
                            .on('finish', function () {
                                console.log('All Finished!');
                            })
                            .on('close', function () {
                                console.log('close!');
                            });

                        file.path = path.join(torrentDir, file.name);
                        file.writeStream = fs.createWriteStream(file.path);
                        source.pipe(file.writeStream);

                        return file;
                    });
            });
        });

        queue.push(item);
        return defer.promise;
    }

    /**
     *
     * @param folder
     * @param callback
     */
    function createFolder(folder, callback) {
        fs.access(folder, function (err, res) {
            if (err) {
                return fs.mkdir(folder, function (err) {
                    if (err) {
                        console.error(err);
                        return callback(err);
                    }
                    callback(null, folder);
                });
            }
            callback(null, folder);
        });
    }

    init();

    return {
        add: add,
        queue: queue
    }
});