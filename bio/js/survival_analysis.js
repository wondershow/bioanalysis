	/**	get the range of
		possible t, see the paper http://www2.sas.com/proceedings/sugi28/261-28.pdf
        the formula of log rank statistic, we need to get i and k in that formula
        @time time array we use to do survival analysis
        @pt the pt array for a censoring indicator for relapse or death, only 0 and 1
    **/
    function get_t_range(time,pt) {
            var res = []; 
            var max = -1,min = 100000;
                
            var i=0;
            for(i=0;i<time.length;i++) {
                if(pt[i] == 1 && time[i] < min) min = time[i];
                if(pt[i] == 1 && time[i] > max) max = time[i];
            }   

            res[0] = min;
            res[1] = max;
			//console.log("min is " + min + ", max = " + max);
			return res;
    }

	
	/**
		This function binarizes a pt array. The binarizing strategy is very simple
		if the value is 1, then the binary value is 1, otherwise it is 0.
	**/
	function sanitize_pt(p) {
		var res = [];
		var i=0;
		for(i=0;i<p.length;i++){
			if(p[i] == 1 || p[i]== '1')
				res[i] = 1;
			else
				res[i] = 0;
		}
		return res;
	}

	/**
		To get the range of an array
	**/
	function getrange(arr) {
		var max=-1,min=10000;
		var i=0;
		for(i=0;i<arr.length;i++) {
			if(arr[i]>max) max = arr[i];
			if(arr[i]<min) min = arr[i];
		}
		var res = [];
		res[0] = min;
		res[1] = max;
		return res;
	}

	/**
		This function calculates a cutpoint curve according to 
		a given a survival time threshold. currently threshold is set 
		to -1 since we have not yet started to use it to do the 
		survival analysisa
		@sur_time the survival time array
		@pt the pt array(censor indicator)
		@pro the property we used to split the data into two groups 

	**/
	function getplot(sur_time,pt,pro,threshold) {
		//threshold = -1;
		var i = 0;
		var pt = sanitize_pt(pt);
		var tmp_t = get_t_range(sur_time,pt);
		
		var object_arr_0 = []; //to store all the objects where pt is 0;
		var object_arr_1 = []; //to store all the objects where pt is 1;
		
		for(i=0;i<sur_time.length;i++) {
			if(pt[i]==0) {
				 if(threshold>=50 && sur_time[i]>threshold){	
				 	object_arr_0.push([threshold,pro[i]]);
				 }
				 else 
					object_arr_0.push([sur_time[i],pro[i]]);
			}
			else	object_arr_1.push([sur_time[i],pro[i]]);			
		}

		
		

		//sort each group
		object_arr_0.sort(function(a,b){
				a[0] = parseFloat(a[0]);
				b[0] = parseFloat(b[0]);
				a[1] = parseFloat(a[1]);
				b[1] = parseFloat(b[1]);
				if(a[0] > b[0]) return 1;
				else if(a[0] < b[0]) return -1;
				else if(a[1] > b[1]) return 1;
				else if(a[1] < b[1]) return -1;
				else return 0;
			}
		);

		//sort each group
		object_arr_1.sort(function(a,b){
				a[0] = parseFloat(a[0]);
				b[0] = parseFloat(b[0]);
				a[1] = parseFloat(a[1]);
				b[1] = parseFloat(b[1]);
				if(a[0] > b[0]) return 1;
				else if(a[0] < b[0]) return -1;
				else if(a[1] > b[1]) return 1;
				else if(a[1] < b[1]) return -1;
				else return 0;
			}
		);
		
		var t_from = tmp_t[0], t_to = tmp_t[1];
		tmp_t = getrange(pro);
		var p_from = tmp_t[0], p_to = tmp_t[1];
		var i,j;

		var res=[];
		return getLogrank(object_arr_0,object_arr_1,t_from,t_to,p_from,p_to,-1);
	}



	function removeDuplicatesInPlace(arr) {
		var i, j, cur, found;
		for (i = arr.length - 1; i >= 0; i--) {
			cur = arr[i];
			found = false;
			for (j = i - 1; !found && j >= 0; j--) {
				if (cur === arr[j]) {
					if (i !== j) {
						arr.splice(i, 1);
					}
					found = true;
				}
			}
		}
		return arr;
	}


	/**
		To calculate one curve of cutpoint
		@sur_time_0 sur_time(sorted) with all censoring indicator is 0
		@sur_time_1 sur_time(sorted) with all censoring indicator is 1
		@cutpoint the value we used to divide the whole data set into two groups
		@threshold -1 not used yet	
		@t_from & t_to range of sur_time
		@c_from & c_to raneg of properties(cutporint ranges)
	**/
	function getLogrank(sur_time_0,sur_time_1,t_from,t_to,c_from,c_to,threshold){
		threshold = -1;
		var cutpoint = c_from;
		var cutpoint_arr = [];
		var sur_time_0_cur=0;//cursor on array 0
		var sur_time_1_cur=0;//cursor on array 1
		


		/**
			The first thing is to find out all cutpoint candidates
		*/
		var i;
		for(i=0;i<sur_time_1.length;i++) {
			if( $.inArray( parseFloat(sur_time_1[i][1]), cutpoint_arr ) < 0 )
				 cutpoint_arr.push(parseFloat(sur_time_1[i][1]));
		}

		cutpoint_arr.sort(function(a,b){
			a = parseFloat(a);
			b = parseFloat(b);
			return a-b;
		});




		//please see http://www2.sas.com/proceedings/sugi28/261-28.pdf logrank formulation 
		var d_plus = 0,d=0,r_plus=0,r=0;
		var total_sample_num = sur_time_0.length + sur_time_1.length;
			
		var res = [];
		
		var m = 0;
		for(m=0;m<cutpoint_arr.length;m++,cutpoint=cutpoint_arr[m]) {
			sur_time_0_cur = 0;
			sur_time_1_cur = 0;
			var sum = 0;
			var log_rank_item = 0;
			var cur_surival_time = sur_time_1[0][0];
			
			var last_d_plus = 0;d_plus = 0,d=0,r_plus=0,r=0;
			var sum_r_plus = 0;

		
			var excluded_items = 0;

			for(i=0;i<sur_time_1.length;i++)
				if(sur_time_1[i][1] >= cutpoint ) sum_r_plus++;
			for(i=0;i<sur_time_0.length;i++)
                if(sur_time_0[i][1] >= cutpoint ) sum_r_plus++;	


			//console.log("cutpoint = " + cutpoint + ", sum_r_plus = " + sum_r_plus);

			while(sur_time_1_cur<=sur_time_1.length) {
				if( sur_time_1_cur == (sur_time_1.length)  ){
					if(sur_time_1[ sur_time_1_cur-1][0] != cur_surival_time){
						excluded_items += d;

						last_d_plus = d_plus;
						if(sur_time_1[sur_time_1_cur-1][1] >= cutpoint) d_plus=1;
						else d_plus = 0;
						d = 1;
						cur_surival_time = sur_time_1[ sur_time_1_cur-1][0];
					}
					while( sur_time_0_cur < sur_time_0.length  &&   sur_time_0[sur_time_0_cur][0] < cur_surival_time ){  
                        if( sur_time_0[sur_time_0_cur][1] >= cutpoint )
                            sum_r_plus--;
                        //excluded_items++;
                        //console.log("exclude item "  + sur_time_0[sur_time_0_cur][0] +"," +sur_time_0[sur_time_0_cur][1]   +" in 0 group" );
                        sur_time_0_cur++;
                    }   
					sum_r_plus -= last_d_plus;
                    // let us compute one item and add it to the sum result
                    r = total_sample_num - excluded_items-sur_time_0_cur;
                    r_plus = sum_r_plus;
                    sum += d_plus - d * r_plus / r;
					//console.log("last_d_plus = " + last_d_plus + ",survival_time = " + cur_surival_time + ",cutpoit is " + cutpoint + ", d = " + d + ", d+ = " + d_plus + ", r = " + r + ",r+ = "+r_plus+",factor is "+factor);//+ ",excluded_items= "+excluded_items);
					break;
				}
				
				if(sur_time_1[ sur_time_1_cur][0] == cur_surival_time ) {// same sum item
					if( sur_time_1[ sur_time_1_cur][1] >= cutpoint ) d_plus++; // add one to death in the R>C group
					
					d++; // add one to death number
					
					/*
					if( sur_time_1[sur_time_1_cur][1] > cutpoint ){
						console.log("11111");
						sum_r_plus--;
					}*/
					
					// we need to also consider the items where pt value is 0
					while(  sur_time_0_cur < sur_time_0.length && sur_time_0[sur_time_0_cur][0] < cur_surival_time     ){
						if( sur_time_0[sur_time_0_cur][1] >=  cutpoint ){
							sum_r_plus--;
							//console.log("222222");
						}
						//excluded_items++;
						//console.log("exclude item "  + sur_time_0[sur_time_0_cur][0] +"," +sur_time_0[sur_time_0_cur][1]   +" in 0 group" );
						sur_time_0_cur++;
					}
				}
				if(sur_time_1[ sur_time_1_cur][0] != cur_surival_time )	{// move to next sum item
					while( sur_time_0_cur < sur_time_0.length && sur_time_0[sur_time_0_cur][0] < cur_surival_time){
						if( sur_time_0[sur_time_0_cur][1] >= cutpoint ){
							//console.log("333333");
							sum_r_plus--;
						}
						//excluded_items++;
						//console.log("exclude item "  + sur_time_0[sur_time_0_cur][0] +"," +sur_time_0[sur_time_0_cur][1]   +" in 0 group" );
						sur_time_0_cur++;
					}
					
					sum_r_plus -= last_d_plus;
					// let us compute one item and add it to the sum result
					r = total_sample_num - excluded_items - sur_time_0_cur;
					r_plus = sum_r_plus;
					var factor = d_plus - d * r_plus / r;
					sum += factor;
					
//					console.log("Time s " + cur_surival_time + ", d1 is " + d + ", d_plus is " + d_plus + ",r is " + r + ", r_plus is "+r_plus+ ",excluded_items= "+excluded_items);
					excluded_items += d;
					//console.log("last_d_plus = " + last_d_plus + ",survival_time = " + cur_surival_time + ",cutpoit is " + cutpoint + ", d = " + d + ", d+ = " + d_plus + ", r = " + r + ",r+ = "+r_plus+",factor is "+factor);//+ ",excluded_items= "+excluded_items);

					//console.log(d_plus+","+d+","+r_plus+","+r);
					last_d_plus = d_plus;
					if(sur_time_1[sur_time_1_cur][1] >= cutpoint) d_plus=1;
					else d_plus = 0;
					d = 1;
					cur_surival_time = sur_time_1[ sur_time_1_cur][0];
				}
				sur_time_1_cur++;
			}
			//console.log("cutpoint is "+cutpoint + " sum is " + sum);
			res.push([cutpoint,Math.abs(sum)]);	
		}
		
		return res;
	}
