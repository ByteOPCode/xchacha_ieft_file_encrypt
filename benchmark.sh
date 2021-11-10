
echo "Algo, mode, File, FileSize in MB, Total Duration in MS, Normalization (mb/sec)">> "test.csv"

for i in {1..5};do
filesToProcess=("baboon.png" "big_bunny_bucks.mp4" "linux-kernel.zip" "ubuntu-20.04.3-desktop-amd64.iso")    
modesToProcess=("encrypt" "decrypt"  "encryptAES" "decryptAES" )

  for files in "${filesToProcess[@]}" ; do
    for modes in "${modesToProcess[@]}" ; do
        if  [[ $modes == de*AES ]] ;

        then
           processingFile="$files.aes"
        elif [[ $modes == de* ]] ;
        then
           processingFile="$files.enc"
        else

           processingFile=$files
        fi
        echo "Processing $processingFile with $modes";
        eval  "npm test $modes $processingFile" >> "test.csv"
       
    done
  done
done 