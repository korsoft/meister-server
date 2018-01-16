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

}
