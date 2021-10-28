echo "Algo, mode, File, FileSize in MB, Total Duration in MS, Normalization (mb/sec)">> "test.csv"
filesToProcess=("baboon.png" "big_bunny_bucks.mp4" "linux-kernel.zip" "ubuntu-20.04.3-desktop-amd64.iso")    
modesToProcess=("encrypt"  "encryptAES" )
for modes in "${modesToProcess[@]}" ; do
    for files in "${filesToProcess[@]}" ; do
        if  [[ $modes =~ de* ]] ;
        then
           files+=".enc"
        else
           files=$files
        fi
        echo "Processing $files with $modes";
        eval  "npm test $modes $files" >> "test.csv"
       
    done
done