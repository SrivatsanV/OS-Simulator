  /*FCFS SCHEDULING*/

  var sequence=[];
  var complete;
  var time;
  var i;
  var total;
  var proc;
  var n;
  var average_wt=0;
  var average_tat=0;
  var stuff=[];
  var index=1;
  var throughput;
  var index=1;
  var cpu_efficiency;
  $(document).ready(function(){
    $('#add').click(function(){
      AddtoList();
    })
    function DisplayList(){
      var table = document.getElementById("ept");
      console.log(stuff[stuff.length-1].no);
      $('#ept').append("<tr><td>"+stuff[stuff.length-1].no+"</td><td>"+stuff[stuff.length-1].at+"</td><td>"+stuff[stuff.length-1].bt1+"</td></tr>");
    }
    function AddtoList(){
      var arrivalTime=parseInt(document.getElementById("at1").value);
      var burstTime=parseInt(document.getElementById("bt1").value);
      // var ioTime=parseInt(document.getElementById("io").value);
      // var FinalburstTime=parseInt(document.getElementById("bt2").value);
  
      if(document.getElementById("at1").value == "") {
        alert("Arrival time field is empty!");
        return;
      }
  
      if(document.getElementById("bt1").value == "") {
        alert("Burst time field is empty!");
        return;
      }
  
      if(arrivalTime < 0) {
        alert("Arrival time cannot be negative!");
        return;
      }
  
      if(burstTime < 0) {
        alert("Burst time cannot be negative!");
        return;
      }
  
      // var ioTime=parseInt(document.getElementById("io").value);
      // var FinalburstTime=parseInt(document.getElementById("bt2").value);
      var ioTime=parseInt("0");
      var FinalburstTime=parseInt("0");
      console.log(arrivalTime);
      console.log(burstTime);
      var rtj=[];
      rtj.push(burstTime);
      rtj.push(ioTime);
      rtj.push(FinalburstTime);
      console.log(rtj);
      stuff.push({
        "at":arrivalTime,
        "bt1":burstTime,
        "io": ioTime,
        "bt2" : FinalburstTime,
        "check" : parseInt("0"),
        "finish" : parseInt("0"),
        "no":index,
        "rt":rtj,
        "point" : parseInt("0"),
        "wt":parseInt("0"),
        "tat":parseInt("0")
      });
      index=index+1;
      document.getElementById("at1").value="";
      document.getElementById("bt1").value="";
      
      console.log(stuff);
      DisplayList();
    };
    $('#start').click(function(){
      fcfs();
      var i = 0;
    console.log(total);
     console.log(sequence[total].start);
      var totalTime = sequence[total].start;
      pixel = parseInt(800/totalTime);
      console.log("%d---%d\n",totalTime,pixel);
      var containerWidth = pixel*totalTime + 2;
      console.log("containerWidth is %d",containerWidth);
      $('#outer-div').css('width',containerWidth+'px');
      displayBlock(i);
    })
    var Q=[];
    function fcfs(){
      var proc=[];
      for(i=0;i<stuff.length;i++){
        proc.push(i+1);
      }
      var n=stuff.length;
      for(i=0;i<n;i++){
        for(j=i+1;j<n;j++){
          if(stuff[i].at>stuff[j].at)
          {
            var temp;
            temp=stuff[i];
            stuff[i]=stuff[j];
            stuff[j]=temp;
            temp=proc[i];
            proc[i]=proc[j];
            proc[j]=temp;
          }
        }
      }
      n=stuff.length;
      console.log(stuff);
      var time=0;
      var complete=0;
      var temp=null;
      var st_time;
      sequence=[];
      if(stuff[0].at>0)
      {
        console.log("Arrival time of the first process is not zero!");
        sequence.push({start:0 , n:null});
        time+=stuff[0].at;
      }
      Enqueue(0);
      var temp=null;
      while(complete!=n)
      {
        var index;
        if(Q.length>0)
          index=Dequeue();
        else
          index=null;
        if(index!=null)
        {
          if(stuff[index].point==0)
          {
            stuff[index].point++;
            stuff[index].check=1;
            sequence.push({start:time, n:proc[index]});
            time+=stuff[index].rt[0];
            if(stuff[index].rt[1]==0 && stuff[index].rt[2]==0)
            {
              complete++;
              stuff[index].finish=1;
              stuff[index].tat=time-stuff[index].at;
              stuff[index].wt=time-stuff[index].at-stuff[index].bt1;
            }
            for(j=0;j<n;j++){
              if(stuff[j].at<=time && stuff[j].finish==0 && stuff[j].check==0 && Q.indexOf(j)==-1)
                Enqueue(j);
              if(stuff[j].at<=time && stuff[j].check==1 && stuff[j].finish==0 && j!=index)
              {
                stuff[j].rt[1]-=stuff[index].rt[0];
                if(stuff[j].rt[1]<=0)
                {
                  stuff[j].check=0;
                  Enqueue(j);
                  stuff[j].point=2;
                }
              }
            }
  
          }
          else if(stuff[index].point==2)
          {
            complete++;
            stuff[index].finish=1;
            sequence.push({start:time,n:proc[index]});
            time+=stuff[index].rt[2];
            stuff[index].tat=time-stuff[index].at;
            stuff[index].wt=time-stuff[index].bt1-stuff[index].bt2-stuff[index].at;
            for(j=0;j<n;j++){
              if(stuff[j].at<=time && stuff[j].finish==0 && stuff[j].check==0 && Q.indexOf(j)==-1)
                Enqueue(j);
              if(stuff[j].at<=time && stuff[j].check==1 && stuff[j].finish==0 && j!=index)
              {
                stuff[j].rt[1]-=stuff[index].rt[2];
                console.log(stuff[j].rt);
                if(stuff[j].rt[1]<=0)
                {
                  stuff[j].check=0;
                  Enqueue(j);
                  stuff[j].point=2;
                }
              }
            }
          }
          temp=index;
        }
        else if(index==null)
        {
          if(temp!=index)
          {
            sequence.push({start:time, n: null});
          }
          time++;
          for(j=0;j<n;j++){
            if(stuff[j].at<=time && stuff[j].finish==0 && stuff[j].check==0 && Q.indexOf(j)==-1)
              Enqueue(j);
            if(stuff[j].at<=time && stuff[j].check==1 && stuff[j].finish==0 && j!=index)
            {
              stuff[j].rt[1]--;
              if(stuff[j].rt[1]<=0)
              {
                stuff[j].check=0;
                Enqueue(j);
                stuff[j].point++;
              }
            }
          }
          temp=index;
        }
        console.log(Q);
        console.log(complete);
  
      }
      sequence.push({start:time,n:-1});
      console.log(sequence);
      console.log(stuff);
      total = sequence.length-1;
      console.log(total);
      var sum_at=0;
      for(i=0;i<n;i++)
        sum_at+=stuff[i].wt;
      average_wt=sum_at/n;
      var sum_tat=0;
      for(i=0;i<n;i++)
        sum_tat+=stuff[i].tat;
      average_tat=sum_tat/n;
      var pixel = 0;
      var sum_null=0;
      throughput=n/time;
      for(i=0;i<sequence.length;i++)
      {
        if(sequence[i].n==null)
        {
          sum_null+=sequence[i+1].start-sequence[i].start;
        }
      }
      cpu_efficiency=((time-sum_null)/time)*100;
    }
    function Enqueue(i){
      Q.push(i);
    }
    function Dequeue(i){
      return Q.shift();
    }
  
    function drawTable(i){
      if(i<stuff.length){
      var table = document.getElementById("ptable");
      console.log(stuff[i].wt);
      $("#ptable").append("<tr><td>"+stuff[i].no+"</td><td>"+stuff[i].at+"</td><td>"+stuff[i].bt1+"</td><td>"+stuff[i].wt+"</td><td>"+stuff[i].tat+"</td></tr>");
      drawTable(i+1);
    }
    else
    {
      var cardAdd = document.getElementById("cardAdd");
       cardAdd.classList.add("card");
       var element = document.getElementById("Average");
      element.classList.add("card-body");
      $("#Average").append("<b>CPU utilization : "+cpu_efficiency.toFixed(3)+"%</b><br>");
      $("#Average").append("<b>Overall throughput : "+throughput.toFixed(3)+"</b><br>");
      $("#Average").append("<b>Average Turn Around time : "+average_tat.toFixed(3)+"</b><br>");
      $("#Average").append("<b>Average Waiting time: "+average_wt.toFixed(3)+"</b><br>");
    }
  
  }
  
    function displayBlock(i){
      if(i == total){
        document.getElementById("ptab").style.display='inline-table';
        drawTable(0);
        return;
      }
  
      var blockWidth = (sequence[i+1].start - sequence[i].start)*pixel;
      var processName = sequence[i].n;
      if(sequence[i].n==null)
      {
        $('#outer-div').append('<div class="block" id="process-'+sequence[i].start +'" style="background-color:rgba(112, 128, 144, 0.44);">CPU Idle<div class="bottom">'+ sequence[i+1].start +'</div></div>');
      }
      else
      {
        $('#outer-div').append('<div class="block" id="process-'+sequence[i].start +'">P'+ sequence[i].n +'<div class="bottom">'+ sequence[i+1].start +'</div></div>');
      }
      $('#process-'+sequence[i].start).css('width',blockWidth);
  
      $('#process-'+sequence[i].start).fadeIn('slow',function(){
        displayBlock(i+1);
      });
  
    }
  });