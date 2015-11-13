# About EMRinger
------------

#### EMRinger is under active development in the [Fraser Lab](http://fraserlab.com). Right now, the EMRinger software and web server are being developed and maintained by [Ben Barad](http://fraserlab.com/members#Ben Barad). 

## Citing EMRinger
The EMRinger web server has not been published formally. Please cite the paper detailing the EMRinger method:

> Barad B.A., Echols N., Wang R.Y.-R., Cheng Y.C., DiMaio F., Adams P.D., Fraser J.S.
> EMRinger: side-chain-directed model and map validation for 3D electron cryomicroscopy. *Nature Methods* **12** 943-946 
> (2015); doi:[10.1038/nmeth.3541](http://dx.doi.org/10.1038/nmeth.3541).

## What is EMRinger?
Coming soon - in the mean time, read the paper (a preprint is available on [biorxiv](http://biorxiv.org/content/early/2015/02/03/014738)), or the [blog post about it](http://fraserlab.com/2015/02/18/EMRinger/).

## Who Develops EMRinger?
EMRinger is under active development in the [Fraser lab at UCSF](http://fraserlab.com), with significant support from the [Phenix group at UC Berkeley](http://phenix-online.org). Ringer was developed by the Alber lab at UC Berkeley. 

## Privacy
In order to run a job on this site, you must upload your map and model. We are very cognizant of the privacy concerns of users with models and maps that have yet to be published. There is no API method (internal or external) to download files once uploaded, even before their deletion. Physical access to the server is required to view uploaded files, and we will not view files without permission from the uploaders for the sake of troubleshooting. Once uploaded, a modified version of the EMRinger scripts are automatically run using these files, and in the absence of errors the files are then immediately deleted. The results of the jobs can be queried if the UUID of the job is known, but the only information that can be externally queried regarding these results are the filenames and the results of the EMRinger scan. Results are kept for one week, at which point they expire and are automatically deleted daily. This is meant to discourage broad searches by UUID to find others results. We plan to implement an API to delete results sooner if the user wishes, but this has not yet been implemented. 

Jobs which fail do not automatically delete the files, so that we can assist with troubleshooting. If you get a failure page, feel free to [email us](mailto:emringer@fraserlab.com) for assistance. We delete all uploaded files at the end of each week via cron job. There is also a publicly exposed API delete those files yourself by sending a DELETE request to http://emringer.com/upload/UUID, where UUID is the uuid of your files.

If you have sufficient privacy concerns, you can rehost this website on a private intranet, where you have total control over everything!

## API
An API for accessing this server is in development, pending replacement of the file upload backend. In the mean time, once you have uploaded files to the server, you can do everything else you might need programmatically (start jobs, check status of jobs, fetch job results, and delete files). You cannot and will never be able to view files once they have been uploaded to the server - only the results of runs. Documentation of the API will be completed once the file upload backend is replaced.

## Contributing
The web server is a flask app which is open source on github at [http://github.com/fraser-lab/emringer_web](http://github.com/fraser-lab/emringer_web) and the cctbx scripts for emringer are also available on github at [http://github.com/fraser-lab/emringer](http://github.com/fraser-lab/emringer). For bugs, please check out the issues on those respective pages.

If you have immediate questions, we are reachable by [email](emringer@fraserlab.com). 


## I found a bug, what do I do?
Email [us](mailto:emringer@fraserlab.com), or post an issue on the [Github page for this web server](https://github.com/fraser-lab/emringerweb/issues).


## Acknowledgements
Nathaniel Echols is the original author of the Ringer scan implementation in cctbx, and Kevin Hartman has been instrumental in the early development of the EMRinger webserver. Nick Merrill has been of great help in developing this web server.

This tool functions thanks to several open source projects:
* [Flask](https://github.com/mitsuhiko/flask)
* [FineUploader](https://github.com/FineUploader/fine-uploader)
* [cctbx](http://cctbx.sourceforge.net/current/)
* [Highcharts](https://github.com/highslide-software/highcharts-release)
* [EMRinger](https://github.com/fraser-lab/EMRinger)

