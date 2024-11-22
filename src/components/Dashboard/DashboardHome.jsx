import StatusGraph from "./StatusGraph";

const DashboardHome = () => {
   return (
      <div className="p-4">
         <h5 className="font-semibold">Dashboard</h5>
         <div className="mt-10 grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5"> 
 <StatusGraph totalNumber="42233" percentNumber="67" yearlyCount="32451" subTitle="total users" upOrDown="up" /> 
 <StatusGraph totalNumber="23784728" percentNumber="43" yearlyCount="43445" subTitle="total users" /> 
 <StatusGraph totalNumber="44465632" percentNumber="33" yearlyCount="44554" subTitle="total users" upOrDown="down" /> <StatusGraph totalNumber="44465632" percentNumber="33" yearlyCount="44554" subTitle="total users" upOrDown="up" /> 
          
      </div>

      </div>
   );
};

export default DashboardHome;
