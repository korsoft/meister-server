<?php 
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Log;

use GuzzleHttp\Exception\GuzzleException;
use GuzzleHttp\Client;
use XmlParser;

class MiddleRestController extends Controller
{

	public function claims(Request $request)
    {
     	$client = new Client(); //GuzzleHttp\Client
		$response = $client->request('GET',"http://meisterv2.dyndns.org:8000/sap/opu/odata/MEISTER/ENGINE/Execute?Endpoint='meister.demo.get.claims'&Parms='[{\"COMPRESSION\":\"\"}]'&Json='{\"TYPE\":\"A\"}'",['auth' => ['arosenthal', 'Pa55word.']]);

		$body = (string) $response->getBody();

		$start = strpos((string)$body, "<d:Json>");
		$end= strpos((string)$body, "</d:Json>");

		$json = json_decode(substr($body, $start+8,$end-$start-8));

		$total = count($json);

		$respObj = (object)array("total"=>$total,'data'=>array());


		foreach ($json as $d) {

		 	$find = array_filter($respObj->data, function ($obj) use ($d){
				
		 		return $obj->WBS==$d->WBS;
		 	});

		 	$tempObj= (object) array();

		 	//print_r($d);
			if(count($find)==0){
				$tempObj->WBS=$d->WBS;

				$find = array_filter($json, function ($obj) use ($d){
				
			 		return $obj->WBS==$d->WBS;
			 	});

			 	$tempObj->total= count($find);

				$respObj->data[]=$tempObj;
			}
		}

		return json_encode($respObj);

    }

    public function details(Request $request)
    {
     	$client = new Client(); //GuzzleHttp\Client
		$response = $client->request('GET',"http://meisterv2.dyndns.org:8000/sap/opu/odata/MEISTER/ENGINE/Execute?Endpoint='meister.demo.get.claims'&Parms='[{\"COMPRESSION\":\"\"}]'&Json='{\"TYPE\":\"A\"}'",['auth' => ['arosenthal', 'Pa55word.']]);

		$body = (string) $response->getBody();

		$start = strpos((string)$body, "<d:Json>");
		$end= strpos((string)$body, "</d:Json>");

		$json = json_decode(substr($body, $start+8,$end-$start-8));

		$total = count($json);

		$data = array();

		$respObj = (object)array("total"=>$total,'data'=>array());


		foreach ($json as $d) {
				$client = new Client(); //GuzzleHttp\Client
				$url = "http://meisterv2.dyndns.org:8000/sap/opu/odata/MEISTER/ENGINE/Execute?Endpoint='meister.demo.claim.details'&Parms='[{\"COMPRESSION\":\"\"}]'&Json='{\"CLAIMNO\":\"".$d->CLAIMNO."\",\"STYLE\":\"I\"}'";
				$response = $client->request('GET',$url,['auth' => ['arosenthal', 'Pa55word.']]);

				$body = (string) $response->getBody();

				$start = strpos((string)$body, "<d:Json>");
				$end= strpos((string)$body, "</d:Json>");

				$jsonTmp = json_decode(substr($body, $start+8,$end-$start-8));
				$jsonTmp=$jsonTmp[0];

				$respTmpObj = (object)array();

				$respTmpObj->CLAIM=$jsonTmp->CLAIM;
				$respTmpObj->DESCRIPTION=$jsonTmp->DESCRIPTION;
				$respTmpObj->DEFECT_LOCATION=$jsonTmp->DEFECT_LOCATION;
				$respTmpObj->WBS=$jsonTmp->APPRAISAL->WBS;
				$respTmpObj->ACCEPTED=$jsonTmp->ACCEPTED;



				$respObj->data[]=$respTmpObj;




		}

		return json_encode($respObj);

    }

    public function detail(Request $request,$claimno)
    {

    	// try{
			$client = new Client(); //GuzzleHttp\Client
			$url = "http://meisterv2.dyndns.org:8000/sap/opu/odata/MEISTER/ENGINE/Execute?Endpoint='meister.demo.claim.details'&Parms='[{\"COMPRESSION\":\"\"}]'&Json='{\"CLAIMNO\":\"".$claimno."\",\"STYLE\":\"D\"}'";
			$response = $client->request('GET',$url,['auth' => ['arosenthal', 'Pa55word.']]);

			if($response->getStatusCode()!="200")
			{
				return "null";		
			}

			$body = (string) $response->getBody();


			$start = strpos((string)$body, "<d:Json>");
			$end= strpos((string)$body, "</d:Json>");

			if($start)
			{
				$jsonTmp = json_decode(substr($body, $start+8,$end-$start-8));
				$jsonTmp=$jsonTmp[0];

				$jsonRes = (object) array();
				$jsonRes->CLAIM=$jsonTmp->CLAIM;
				$jsonRes->COSTS=(object)(array());
				$jsonRes->COSTS->ACCEPTED=$jsonTmp->COSTS->ACCEPTED;
				$jsonRes->COSTS->REQUIRED=$jsonTmp->COSTS->REQUIRED;
				$jsonRes->COSTS->ESTIMATED=$jsonTmp->COSTS->ESTIMATED;

				//$COST_MATRIX = $jsonTmp->COSTS->COST_MATRIX[0];

				$jsonRes->COSTS->COST_MATRIX=[];
				foreach ($jsonTmp->COSTS->COST_MATRIX as $COST_MATRIX) {
					array_push($jsonRes->COSTS->COST_MATRIX, 
						[
							"ITEM_NO" => $COST_MATRIX->ITEM_NO,
							"COST_OBJECT" => $COST_MATRIX->COST_OBJECT,
							"CATEGORY" => $COST_MATRIX->CATEGORY,
							"PLANT" => $COST_MATRIX->PLANT,
							"TOTAL_PRICE" => $COST_MATRIX->TOTAL_PRICE
						]
					);
				}
				

				$APPRAISAL = $jsonTmp->APPRAISAL;
				$jsonRes->APPRAISAL=(object)(array());
				$jsonRes->APPRAISAL->PROJECT=$APPRAISAL->PROJECT;
				$jsonRes->APPRAISAL->WBS=$APPRAISAL->WBS;
				$jsonRes->APPRAISAL->CODE_TEXT=$APPRAISAL->CODE_TEXT;
				$jsonRes->APPRAISAL->CAUSE=$APPRAISAL->CAUSE;
				$jsonRes->APPRAISAL->START_DATE=\DateTime::createFromFormat("YmdHis",$APPRAISAL->REQUIRED_DATE_START->DATE.$APPRAISAL->REQUIRED_DATE_START->TIME)->format("M d, Y H:i:s");
				$jsonRes->APPRAISAL->END_DATE=\DateTime::createFromFormat("YmdHis",$APPRAISAL->REQUIRED_DATE_END->DATE.$APPRAISAL->REQUIRED_DATE_END->TIME)->format("M d, Y H:i:s");


				$jsonRes->BUDGETS=array();

				foreach ($jsonTmp->BUDGETS->BUDGETS as $b ) {
					$budtmp=(object)(array());
					$budtmp->WBS_ELEMENT=$b->WBS_ELEMENT;
					$budtmp->COST=array();
					foreach ($b->COSTS as $c) {
						$cost=(object)(array());
						$cost->YEAR=$c->YEAR;
						$cost->COST_PLAN_TCUR=$c->COST_PLAN_TCUR;
						$cost->DISTRIBUTED_TCUR= $c->DISTRIBUTED_TCUR;
						$cost->DISTRIBUTABLE_TCUR = $c->DISTRIBUTABLE_TCUR;

						$budtmp->COST[]=$cost;
					}
					
					$jsonRes->BUDGETS[]=$budtmp;
				}



				return json_encode($jsonRes);
			}

			return null;
		// }catch(\Exception $ex)
		// {
		// 	return $ex->getMessage();
		// }

    }

    public function simulate(Request $request)
    {
    	//print_r($request->input("Json"));
    	$client = new Client(); 
    	$json = json_decode($request->input("Json"));
    	if(!$json)
    	{
    		return null;
    	}

    	$url = "http://meisterv2.dyndns.org:8000/sap/opu/odata/MEISTER/ENGINE/Execute?Endpoint='meister.demo.approve.claim'&Parms='[{\"COMPRESSION\":\"\"},{\"TEST_RUN\":\"X\"}]'&Json='".json_encode($json)."'";

    	$response = $client->request('GET',$url,['auth' => ['arosenthal', 'Pa55word.']]);

		if($response->getStatusCode()!="200")
		{
			return "null";		
		}

		$body = (string) $response->getBody();


		$start = strpos((string)$body, "<d:Json>");
		$end= strpos((string)$body, "</d:Json>");

		if($start)
		{
			$json = json_decode(substr($body, $start+8,$end-$start-8));

			$output = array();

			foreach ($json as $jsonTmp ) 
			{
				

				$tmp = array();

				foreach ($jsonTmp->BUDGETS	 as $o) {
					$tmp2 = (object)array();
					$tmp2->WBS_ELEMENT=$o->WBS_ELEMENT;
					$tmp2->COST=array();

					foreach ($o->COSTS as $c ) {
						$cost=(object)(array());
						$cost->YEAR=$c->YEAR;
						$cost->COST_PLAN_TCUR=$c->COST_PLAN_TCUR;
						$cost->DISTRIBUTED_TCUR= $c->DISTRIBUTED_TCUR;
						$cost->DISTRIBUTABLE_TCUR = $c->DISTRIBUTABLE_TCUR;

						$tmp2->COST[]=$cost;
					}
					$tmp[]=$tmp2;
				}		

				$output[] = $tmp;
			}

			return $output;
		}

    }   

    public function approve(Request $request)
    {
    	//print_r($request->input("Json"));
    	$client = new Client(); 
    	$json = json_decode($request->input("Json"));
    	if(!$json)
    	{
    		return "json";
    	}

    	$url = "http://meisterv2.dyndns.org:8000/sap/opu/odata/MEISTER/ENGINE/Execute?Endpoint='meister.demo.approve.claim'&Parms='[{\"COMPRESSION\":\"\"},{\"TEST_RUN\":\"\"}]'&Json='".json_encode($json)."'";

    
    	$response = $client->request('GET',$url,['auth' => ['arosenthal', 'Pa55word.']]);

		if($response->getStatusCode()!="200")
		{
			return "200";		
		}

		$body = (string) $response->getBody();

		$start = strpos((string)$body, "<d:Json>");
		$end= strpos((string)$body, "</d:Json>");

		if($start)
		{
			$json = json_decode(substr($body, $start+8,$end-$start-8));

			$output = array();

			foreach ($json as $jsonTmp ) 
			{
				
				$tmp = (object)array();
				if(isset($jsonTmp->BUDGETS))
				{
					$tmp->SUCSESS=true;
				}else
				{
					$tmp->SUCSESS=false;
				}

				$output[] = $tmp;
			}

			return $output;
		}

		return "s";

    }    

    public function reports(Request $request)
    {
     	$client = new Client(); //GuzzleHttp\Client
		$response = $client->request('GET',"http://meisterv2.dyndns.org:8000/sap/opu/odata/MEISTER/ENGINE/Execute?Endpoint='meister.report.scheduler'&Parms='[{\"METADATA\":\"\",\"REPORT_TYPE\":\"T\"}]'&Json='{\"USERNAME\":\"AROSENTHAL\",\"REPORT\":{\"MODE\":\"R\",\"NAME\":\"RM07DOCS\",\"PARAMETERS\":[{\"SELNAME\":\"MATNR\",\"KIND\":\"S\",\"SIGN\":\"I\",\"OPTION\":\"EQ\",\"LOW\":\"CK-700\"}]},\"EMAIL\":\"AXROSENTHAL@GMAIL.COM\",\"VIA_EMAIL\":\"X\"}'&\$format=json",['auth' => ['arosenthal', 'Pa55word.']]);

		if($response->getStatusCode()!="200"){
			return [];
		}	
	
		 return $response->getBody();

	
    }

    public function schelule_report(Request $request, $reportName){
    	$client = new Client();
    	$response = $client->request('GET',"http://meisterv2.dyndns.org:8000/sap/opu/odata/MEISTER/ENGINE/Execute?Endpoint='meister.report.scheduler'&Parms='[{\"METADATA\":\"\",\"REPORT_TYPE\":\"T\"}]'&Json='{\"USERNAME\":\"AROSENTHAL\",\"REPORT\":{\"MODE\":\"R\",\"NAME\":\"" . $reportName ."\",\"PARAMETERS\":[{\"SELNAME\":\"MATNR\",\"KIND\":\"S\",\"SIGN\":\"I\",\"OPTION\":\"EQ\",\"LOW\":\"CK-700\"}]},\"EMAIL\":\"AXROSENTHAL@GMAIL.COM\",\"VIA_EMAIL\":\"X\"}'&\$format=json",['auth' => ['arosenthal','Pa55word.']]);

    	if($response->getStatusCode()!="200"){
			return [];
		}	
	
		return $response->getBody();
    }

    public function list_reports(Request $request)
    {
     	$client = new Client(); //GuzzleHttp\Client
		$response = $client->request('GET',"http://meisterv2.dyndns.org:8000/sap/opu/odata/MEISTER/ENGINE/Execute?Endpoint='meister.report.list'&Parms='{}'&Json='{\"USERNAME\":\"AROSENTHAL\"}'&\$format=xml",['auth' => ['arosenthal', 'Pa55word.']]);

		if($response->getStatusCode()!="200"){
			return [];
		}	
	
		$body = (string) $response->getBody();

		$start = strpos((string)$body, "<d:Json>");
		$end= strpos((string)$body, "</d:Json>");

		$json_string = substr($body, $start+8,$end-$start-8);

		//return str_replace("]}", "}]", $json_string);
		return json_decode(str_replace("]}", "}]", $json_string), true);
	
    }

    public function reports_details(Request $request, $pki)
    {
     	$client = new Client(); //GuzzleHttp\Client
		$response = $client->request('GET',"http://meisterv2.dyndns.org:8000/sap/opu/odata/MEISTER/ENGINE/Execute?Endpoint='meister.report.retriever'&Parms='{}'&Json='{\"PKY\":\"" .$pki ."\"}'&\$format=json",['auth' => ['arosenthal', 'Pa55word.']]);

		if($response->getStatusCode()!="200"){
			return [];
		}

		$body = (string) $response->getBody();

		$result = json_decode($body, true);

		if(is_array($result) && count($result)>0){
			if(isset($result["d"]) && isset($result["d"]["results"]) && isset($result["d"]["results"][0]) ){
				$report = $result["d"]["results"][0];
				Log::info("report",["array"=>$report]);
				if(isset($report["Json"])){
					$json_substring = substr($report["Json"],stripos($report["Json"],"\"JSON\":\""));
					$json = "{" . substr($json_substring, 0,strlen($json_substring)-2) . "]}";
					$json =  json_decode($json,true);
					$json = json_decode($json["JSON"], true);
					$arrResult = [];
					$row = 0;
					foreach ($json as $item) {
						$row++;
						if($row<3)
							continue;
						
						if(isset($item["MATERIALMATERIALDESCRIPTIONPLN"])){
						$columns = explode(" ",$item["MATERIALMATERIALDESCRIPTIONPLN"]);
							array_push($arrResult, [
								"SLoc"=>$columns[0],
								"MvT"=>$columns[1],
								"SMatDoc"=>$columns[2],
								"item"=>$columns[3],
								"PstngDate"=>$columns[4],
								"Quantity"=>$columns[5],
								"UnE"=>$columns[6]
							]);
						}
					}
					return $arrResult;
				}

			}
		}
		return [];

    }

}


