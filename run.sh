while true
do
  echo "--- Memulai Bot Maomao ---"
  node index.js
  if [ $? -eq 2 ]; then
    echo "--- Restart diperintahkan, memulai ulang... ---"
    sleep 2
  else
    echo "--- Bot berhenti secara normal. Keluar... ---"
    break
  fi
done