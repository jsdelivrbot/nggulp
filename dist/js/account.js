let AccountController = function ($log, $scope, $q, $http, $filter, $timeout, i18nService, $controller, uiGridConstants, $localStorage,Upload) {

    let genders = [ { value: '1', label: 'male' }, { value: '2', label: 'female' }, { value: '3', label: 'other'} ];
    $scope.errmsg = {
        required: "Could not be empty",
        duplicate: "Duplicate value",
        password: {
            pattern: "Password must be between 4 and 8 digits long and include at least one numeric digit."
        },
        email: {
            pattern: "Email here."
        }
    };
    $scope.msgInvalidedImage = "invalid image";
    $scope.bunchEditAble = 0;
    $scope.paginationPageSizes = [10, 20, 30, 50, 100];
    $scope.paginationPageSize = 100;
    $scope.num2gen = '';
    $scope.offset = 0;
    $scope.limit = 1000;
    $scope.isFormChecked = false;
    $scope.isReachLimit = 0;
    $scope.host = 'https://playscang.herokuapp.com';

//===================================================functions==========================================================
    /**
     * link for the action column
     * @param link
     * @param grid
     * @param row
     * @return {string}
     */
    $scope.getActionLink = function(link, grid,row){
        let editLink = "/server/edit";
        let cloneLink = "/server/clone";
        let deleteLink = "/server/delete";
        if(link===1) return editLink;
        if(link===2) return deleteLink;
        if(link===3) return cloneLink;
    };

    /**
     * get cell template for different column
     * @param col
     * @return {string}
     */
    $scope.getCellTemplate = function(col){
        let template = '';
        switch(col){
            case 'address':
                template = '<div class="ui-grid-cell-contents">' +
                    '<div class="dropdown">' +
                    '  <div class="tag-cell">{{row.entity.tag}}</div>' +
                    '  <div class="dropdown-content">{{row.entity.tag}}</div>' +
                    '</div>' +
                    '</div>';
                break;
            case 'website':
                template = '<div class="ui-grid-cell-contents"><a href="{{row.entity.website}}">{{row.entity.website}}</a></div>';
                break;
            case 'action':
                template = '<div class="ui-grid-cell-contents">' +
                    '<span>' +
                    '<a href="{{grid.appScope.getActionLink(1, grid, row)}}"><span class="glyphicon glyphicon-edit"></span></a>&nbsp;&nbsp;|&nbsp;&nbsp;' +
                    '<a href="{{grid.appScope.getActionLink(2, grid, row)}}"><span class="glyphicon glyphicon-trash"></span></a>&nbsp;&nbsp;|&nbsp;&nbsp;' +
                    '<a href="{{grid.appScope.getActionLink(3, grid, row)}}"><span class="glyphicon glyphicon-duplicate"></span></a>' +
                    '</span>' +
                    '</div>';
                break;
            default:
                break;
        }
        return template;
    };

    /**
     * check if button is clickable
     */
    $scope.isClickable = function(){
        let rows = $scope.gridApi.selection.getSelectedRows();
        let noRows = rows.length;
        let clickable = 0;
        if(noRows>0){
            clickable = 1;
        }
        return clickable;
    };


    /**
     *
     */
    $scope.doSt = function(){
        if($scope.isClickable()){
            alert("do something");
        }

    };


    /**
     *
     */
    $scope.getData = function (offset,limit) {
        let url = `${$scope.host}/account/getXAccounts/${offset}/${limit}`;
        $http.get(url).then(rp =>{
            let gridData = rp.data;
            gridData.forEach(function (gdata, key) {
                // /console.log(gdata);
            });
            $scope.gridOptions.data = gridData;
            //get more data for later
            let from  = offset + limit;
            let to = limit;
            $scope.preLoadMore(from,to);
        });
    };

    /**
     * show hide add form
     */
    $scope.showAddForm = function(){
        $("#divAddForm").toggle();
    };

    /**
     * autofill adding form
     */
    $scope.autoFill = function(){
        let time =  new Date().getTime();
        let name = "demo"+time;
        $scope.accountForm = {
            name:name,
            jp_name:"デモ"+name,
            username:name,
            password:"demo",
            email:name+"@yahoo.com",
            website:"http://wwww."+name+".com",
            age:25,
            gender:"1"
        }
    };

    /**
     * reset form to the default value
     */
    $scope.resetForm = function(){
        $scope.frmAccount.$error = {};
        $scope.accountForm = $scope.getDefaultForm();
        $scope.isFormChecked = false;
    };

    /**
     * init default value form
     * @type {{name: string, jp_name: string, username: string, password: string, email: string, website: string, age: string, gender: string}}
     */
    $scope.getDefaultForm = function(){
        return {
            name:"",
            jp_name:"",
            username:"",
            password:"",
            email:"",
            website:"",
            age:"",
            gender:"1"
        };
    };


    $scope.refreshGrid = function () {
        $timeout(function () {
            $scope.gridApi.grid.refresh();
        });
    };

    /**
     * get the record has just inserted
     * @param id
     */
    $scope.getInserted  = function(id){
        let url = `${$scope.host}/account/api/getInserted/${id}`;
        return $http.get(url)
    };

    /**
     * fire when user click submit add form
     */
    $scope.add = function(){
        $scope.isFormChecked = true;
        if($scope.frmAccount.$valid){
            let url = `${$scope.host}/account/add`;
            let data = $scope.accountForm;
            $http.post(url,data).then(rp =>{
                if(rp.data.success==="1"){
                    let row = {};
                    let xhr = $scope.getInserted(rp.data.id);
                    xhr.then(rp =>{
                        if(rp.data){
                            row = rp.data[0];
                            $scope.gridOptions.data.push(row);
                            $scope.refreshGrid();
                        }
                    });
                }
            });

        }
        else{
            $scope.doFocus();
        }
    };


    /**
     * focus on the invalid inputs
     */
    $scope.doFocus = function(){
        //focus on error input
        if($scope.frmAccount.$error){
            if($scope.frmAccount.$error.required){
                $scope.frmAccount.$error.required[0].$$element.focus();
            }else if($scope.frmAccount.$error.pattern){
                $scope.frmAccount.$error.pattern[0].$$element.focus();
            }else if($scope.frmAccount.$error.exist){
                $scope.frmAccount.$error.exist[0].$$element.focus();
            }else if($scope.frmAccount.$error.unique){
                $scope.frmAccount.$error.unique[0].$$element.focus();
            }
        }
    };


    /**
     * load 10000 records before user click Load More button
     */
    $scope.preLoadMore = function(offset,limit){
        if(limit >= $scope.totalRows) {
            limit = $scope.totalRows;
            $scope.isReachLimit = 1;
        }
        let url = `${$scope.host}/account/getXAccounts/${offset}/${limit}`;
        $http.get(url).then(rp => {
            $scope.nextRecords =  rp.data;
        });
        $scope.offset  = offset + limit;
        $scope.limit = limit;
    };


    /**
     * when user click on Load More button
     */
    $scope.loadMore = function(){
        $scope.gridOptions.data = $.merge($scope.gridOptions.data, $scope.nextRecords);
        $scope.refreshGrid();
        //after extend rs to list
        $timeout($scope.preLoadMore($scope.offset,$scope.limit));

    };


    /**
     * auto generate record, user input the amount to gen on screen
     */
    $scope.genRecords = function(){
        let num2gen = $scope.num2gen;
        let url = `${$scope.host}/account/genRecords/${num2gen}`;
        $http.get(url).then(rp => {
            $scope.setNumRows();
        });

    };


    /**
     * get total num rows of all account table
     */
    $scope.getNumRows = function(){
        let url = `${$scope.host}/account/getNumRows`;
        return $http.get(url);
    };


    /**
     * set total numrow to scope for displaying
     */
    $scope.setNumRows = function(){
        let promise = $scope.getNumRows();
        let numRow = 0;
        promise.then(rp => {
            numRow = rp.data.numRows;
            $scope.totalRows = numRow;
        });
    };


    /**
     * upload image
     * @param file
     * @param errFiles
     * @param event
     */
    $scope.uploadFiles = function(file, errFiles, event) {
        let error = errFiles && errFiles[0];
        let defer = $q.defer();
        if (file) {
            file.upload = Upload.upload({
                url: `${$scope.host}/account/upload`,
                data: {file: file}
            });

            file.upload.then(function (response) {
                defer.resolve(response.data);
                file.src = response.data;
            }, function (response) {
                defer.reject();
                if (response.status > 0)
                    $scope.errorMsg = response.status + ': ' + response.data;
            }, function (evt) {
                defer.resolve();
                file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            });
        }
        if(error){
            defer.resolve();
            //set input file value =''
            event.target.value = '';
            alert($scope.msgInvalidedImage);
        }
    };


    $scope.getGridOptions = function(){
        const columnDefs = [{
            position: 0,
            displayName: 'ID',
            field: 'id',
            minWidth: 50,
            enableSorting: true,
            enableFiltering: false,
            enableColumnMenu: false,
        }, {
            position: 1,
            displayName: 'Username',
            field: 'username',
            minWidth: 100,
            enableSorting: true,
            enableFiltering: true,
            enableColumnMenu: false
        }, {
            position: 2,
            displayName: 'Email',
            field: 'email',
            minWidth: 150,
            enableSorting: true,
            enableFiltering: true,
            enableColumnMenu: false
        }, {
            position: 2,
            displayName: 'Name',
            field: 'name',
            minWidth: 150,
            enableSorting: true,
            enableFiltering: true,
            enableColumnMenu: false
        }, {
            position: 2,
            displayName: 'J Name',
            field: 'jp_name',
            minWidth: 100,
            enableSorting: true,
            enableFiltering: true,
            enableColumnMenu: false
        }, {
            position: 3,
            displayName: 'Gender',
            field: 'gender',
            minWidth: 50,
            enableSorting: false,
            cellFilter: 'mapGender',
            enableFiltering: true,
            filter: {
                type: uiGridConstants.filter.SELECT,
                selectOptions: genders
            },
            enableColumnMenu: false
        }, {
            position: 4,
            displayName: 'Website',
            field: 'website',
            minWidth: 200,
            enableSorting: false,
            enableFiltering: true,
            enableColumnMenu: false,
            cellTemplate: $scope.getCellTemplate('website')
        }, {
            position: 5,
            displayName: 'Age',
            field: 'age',
            filters: [
                {
                    condition: uiGridConstants.filter.GREATER_THAN,
                    placeholder: 'min'
                },
                {
                    condition: uiGridConstants.filter.LESS_THAN,
                    placeholder: 'max'
                }
            ],
            minWidth: 30,
            enableSorting: true,
            enableFiltering: true,
            enableColumnMenu: false
        }, {
            position: 6,
            name: "Action",
            minWidth: 100,
            enableSorting: false,
            enableFiltering: false,
            enableColumnMenu: false,
            exporterEnableExporting: false,
            cellTemplate: $scope.getCellTemplate('action')
        }];
        let gridOptions = {
            //init: i18nService.setCurrentLang('ja'),
            //i18n: 'ja',
            columnDefs: columnDefs,
            rowHeight:40,
            //enableGridMenu: true,
            //exporterCsvFilename: '10000_records.csv',
            enableSelectAll: true,
            enableColumnResizing: true,
            enableFiltering: true,
            enableRowSelection:true,
            enableRowHeaderSelection: true,
            paginationPageSizes: $scope.paginationPageSizes,
            paginationPageSize: $scope.paginationPageSize,
            enablePaginationControls: true,
            multiSelect: true,
            onRegisterApi: function (gridApi) {
                $scope.gridApi = gridApi;
                gridApi.selection.on.rowSelectionChanged($scope,function(row){
                    $scope.isClickable = $scope.isClickable();
                });
            }
        };
        return gridOptions;
    };
//===================================================debug==============================================================
    $scope.log = function(){
        console.log($scope);
    };
//===================================================exec===============================================================
    $scope.gridOptions = $scope.getGridOptions();
    $scope.accountForm = $scope.getDefaultForm();
    $scope.setNumRows();
    $scope.getData($scope.offset,$scope.limit);

};
AccountController.$inject = ['$log', '$scope', '$q', '$http', '$filter','$timeout', 'i18nService', '$controller', 'uiGridConstants','$localStorage','Upload'];
app.controller('AccountController', AccountController);
