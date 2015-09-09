# About EMRinger
------------

#### EMRinger is under active development in the [Fraser Lab](http://fraserlab.com). Right now, the EMRinger software and web server are being developed and maintained by [Ben Barad](http://fraserlab.com/members#Ben Barad). 



## Citing EMRinger
The EMRinger web server has not been published formally. Please cite the paper detailing the EMRinger method:

> Barad B.A., Echols N., Wang R.Y.-R., Cheng Y.C., DiMaio F., Adams P.D., Fraser J.S.
> EMRinger: side-chain-directed model and map validation for 3D electron cryomicroscopy. *Nature Methods* published online 
> 17 August 2015; doi:[10.1038/nmeth.3541](http://dx.doi.org/10.1038/nmeth.3541).

## What is EMRinger?
Coming soon - in the mean time, read the paper or the [blog post about it](http://fraserlab.com/2015/02/18/EMRinger/)

## Who Develops EMRinger?
Ringer was developed by the Alber lab at UC Berkeley. 
EMRinger is under active development in the [Fraser lab at UCSF](http://fraserlab.com), with significant support from the [Phenix group at UC Berkeley](http://phenix-online.org).

## Privacy
In order to run a job on this site, you must upload your map and model. A modified version of the EMRinger scripts are run using these files, and in the absence of errors the files are then immediately deleted. Results for successful jobs will be accessible for a week (for now.. this may change in the future).

Jobs which fail do not automatically delete the files, so that we can assist with troubleshooting. If you get a failure page, feel free to [email us](mailto:emringer@fraserlab.com) for assistance. We'll delete them at the end of each week if you do not contact us sooner.

If you are technically minded, you can delete those files yourself by sending a DELETE request to http://emringer.com/upload/YOUR\_UUID, where YOUR\_UUID is the uuid of your files.

## Contributing
The web server is a flask app which is open source on github at [http://github.com/fraser-lab/emringer_web](http://github.com/fraser-lab/emringer_web) and the cctbx scripts for emringer are also available on github at [http://github.com/fraser-lab/emringer](http://github.com/fraser-lab/emringer). For bugs, please check out the issues on those respective pages.

If you have immediate questions, we are reachable by [email](emringer@fraserlab.com). 


## I found a bug, what do I do?
Email [us](mailto:emringer@fraserlab.com), or post an issue on the [Github page for this web server](https://github.com/fraser-lab/emringerweb/issues).


## Acknowledgements
Nathaniel Echols is the original author of the Ringer scan implementation in cctbx, and Kevin Hartman has been instrumental in the early development of the EMRinger webserver. Nick Merrill has been of great help in developing this web server.

