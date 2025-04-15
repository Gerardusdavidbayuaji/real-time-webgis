const PopupCard = (features) => {
  return features
    .map((f) => {
      const { fid, nama_sensor, nmfield, satuan, keterangan, value } =
        f.properties;

      return `
      <div class="gap-y-1">
        <div>
          <img src="/assets/awlr-dummy.jpg" alt="awlr-dummy" class="w-full h-full object-cover rounded-md"/>
        </div>
        <div>
          <div><strong>${fid}-Sensor</strong> : ${nama_sensor}</div>
          <div><strong>Field</strong>         : ${nmfield}</div>
          <div><strong>Keterangan</strong>    : ${keterangan}</div>
          <div><strong>Nilai</strong>         : ${value} ${satuan}</div>
        </div>
      </div>
    `;
    })
    .join('<hr style="margin: 6px 0; border-color: white;" />');
};

export default PopupCard;
