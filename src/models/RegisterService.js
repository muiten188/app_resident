var RegisterService = {
  apartmentId: '',
  attachmentFiles: [],
  registrationType: '',
  vehicleOwnerName: '',
  vehicleBrand: '',
  vehicleModel: '',
  vehicleColor: '',
  vehicleCompany: 'NO',
  vehicleOwner: 'YES',
  vehiclePlate: '',
  serviceType: '',
  json: () => {
    return {
      apartmentId: RegisterService.apartmentId,
      attachmentFiles: RegisterService.attachmentFiles,
      registrationType: RegisterService.registrationType,
      vehicleOwnerName: RegisterService.vehicleOwnerName,
      vehicleBrand: RegisterService.vehicleBrand,
      vehicleModel: RegisterService.vehicleModel,
      vehicleColor: RegisterService.vehicleColor,
      vehicleCompany: RegisterService.vehicleCompany,
      vehicleOwner: RegisterService.vehicleOwner,
      vehiclePlate: RegisterService.vehiclePlate,
      serviceType: RegisterService.serviceType,
    };
  },
  clear: () => {
    RegisterService.apartmentId = '';
    RegisterService.attachmentFiles = [];
    RegisterService.registrationType = '';
    RegisterService.vehicleOwnerName = '';
    RegisterService.vehicleBrand = '';
    RegisterService.vehicleModel = '';
    RegisterService.vehicleColor = '';
    RegisterService.vehicleCompany = 'NO';
    RegisterService.vehicleOwner = 'YES';
    RegisterService.vehiclePlate = '';
    RegisterService.serviceType = '';
  }
};

export default RegisterService;