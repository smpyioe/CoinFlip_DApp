CONTRACT_NAME=$1

if [ -z "$CONTRACT_NAME" ]; then
  echo "Usage: $0 <ContractName>"
  exit 1
fi

SRC_PATH="./out/$CONTRACT_NAME.sol/$CONTRACT_NAME.json"
DEST_PATH="../frontend/src/abi/$CONTRACT_NAME.json"

mkdir -p ../frontend/src/abi
cp $SRC_PATH $DEST_PATH

echo "ABI copied to frontend/src/abi/$CONTRACT_NAME.json"
