const PopupCard = (features) => {
  return features
    .map((f) => {
      const { fid, nama_sensor, nmfield, satuan, keterangan, value } =
        f.properties;

      return `
      <div style="margin-bottom: 8px;">
        <div><strong>${fid}-Sensor</strong> : ${nama_sensor}</div>
        <div><strong>Field</strong>         : ${nmfield}</div>
        <div><strong>Keterangan</strong>    : ${keterangan}</div>
        <div><strong>Nilai</strong>         : ${value} ${satuan}</div>
      </div>
    `;
    })
    .join('<hr style="margin: 6px 0; border-color: white;" />');
};

export default PopupCard;
