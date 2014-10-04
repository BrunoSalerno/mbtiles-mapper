mbtiles-mapper
==============

A client-side [mbitles](https://github.com/mapbox/mbtiles-spec) mapper for mbtiles uncompressed file.
Supports utfgrid and reads all metadata created by [Tilemil](https://www.mapbox.com/tilemill/).

Usage
=====

* Git clone this repository

* Uncompress your mbtiles file using [mbutil](https://github.com/mapbox/mbutil) with the `--grid_callback=""` option:

```
mb-util --grid_callback="" your_file.mbtiles destination_folder
```

* Modify `tiles_path` option in `config.json` with the destination folder path

* Start a static server to serve your map. For example, with [http-server](https://www.npmjs.org/package/http-server), go to your map directory and run:

```
http-server ./
```

* So you have your map in `http://localhost:8080`

Options can be modified in `config.json`. The `use_mbtiles_legend` option allows you to toggle between Tilemil generated legend and the one
created by you in index.html.

Libraries
=========

In the `lib` folder there are the needed libraries:

* [Jquery](http://jquery.com/)
* [Leaflet](https://github.com/Leaflet/Leaflet)
* [utfgrid.leaflet](https://github.com/danzel/Leaflet.utfgrid)

License
=======
MIT





